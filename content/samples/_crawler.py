#!/usr/bin/env python3
"""Crawl kỹ thuật một site đối thủ (chỉ đọc, tôn trọng robots.txt, 1,5 s/request).

Chạy:  python3 -I content/samples/_crawler.py <domain> [--cache DIR]
Ra:    content/samples/<domain>/{robots.txt, sitemaps/*.xml, urls.csv, pages.json, structure.md, internal-links.md}
       structure.md / internal-links.md chỉ phần số liệu tự sinh; nhận xét viết tay ở analysis.md.
HTML thô chỉ cache ở --cache (mặc định /tmp/velis-crawl), không commit.
Chỉ học kỹ thuật – xem content/guide/rules.md.
"""
import argparse, collections, csv, gzip, hashlib, json, os, re, ssl, sys, time
import urllib.parse as up, urllib.request as ur, urllib.robotparser as rp
import xml.etree.ElementTree as ET
from html.parser import HTMLParser

UA = "Mozilla/5.0 (compatible; VelisResearchBot/1.0; one-off structure study)"
CA = "/root/.ccr/ca-bundle.crt"
DELAY = 1.5
MAX_PER_TYPE = 5
NS = "{http://www.sitemaps.org/schemas/sitemap/0.9}"

CTX = ssl.create_default_context(cafile=CA) if os.path.exists(CA) else ssl.create_default_context()
_last = [0.0]


class Blocked(Exception):
    pass


def fetch(url, cache):
    """GET có cache; lỗi mạng (proxy/DNS) -> Blocked để dừng hẳn, không thử cách khác."""
    key = os.path.join(cache, hashlib.sha1(url.encode()).hexdigest())
    if os.path.exists(key):
        with open(key, "rb") as f:
            return 200, f.read()
    wait = DELAY - (time.time() - _last[0])
    if wait > 0:
        time.sleep(wait)
    _last[0] = time.time()
    req = ur.Request(url, headers={"User-Agent": UA, "Accept-Encoding": "gzip"})
    try:
        with ur.urlopen(req, context=CTX, timeout=30) as r:
            body = r.read()
            if r.headers.get("Content-Encoding") == "gzip":
                body = gzip.decompress(body)
            code = r.status
    except ur.HTTPError as e:
        return e.code, b""
    except (ur.URLError, OSError) as e:
        raise Blocked(f"{url}: {e}")
    os.makedirs(cache, exist_ok=True)
    with open(key, "wb") as f:
        f.write(body)
    return code, body


# ---------- sitemap ----------

def read_sitemaps(base, robots_txt, cache, out):
    starts = re.findall(r"(?im)^\s*sitemap:\s*(\S+)", robots_txt) or [base + "/sitemap_index.xml", base + "/sitemap.xml", base + "/wp-sitemap.xml"]
    seen, rows, todo = set(), [], list(starts)
    os.makedirs(os.path.join(out, "sitemaps"), exist_ok=True)
    while todo:
        sm = todo.pop(0)
        if sm in seen:
            continue
        seen.add(sm)
        code, body = fetch(sm, cache)
        if code != 200 or not body.strip().startswith(b"<"):
            continue
        name = re.sub(r"[^a-z0-9_.-]", "_", up.urlparse(sm).path.strip("/").lower()) or "sitemap.xml"
        with open(os.path.join(out, "sitemaps", name), "wb") as f:
            f.write(body)
        try:
            root = ET.fromstring(body)
        except ET.ParseError:
            continue
        src = re.sub(r"(-?sitemap\d*)?\.xml$", "", name) or "sitemap"
        for s in root.findall(NS + "sitemap"):
            todo.append(s.findtext(NS + "loc").strip())
        for u in root.findall(NS + "url"):
            rows.append((u.findtext(NS + "loc").strip(), (u.findtext(NS + "lastmod") or "").strip(), src))
    return rows


# ---------- HTML ----------

VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}
CHROME_TAGS = {"header", "nav", "footer", "aside"}
CHROME_CLS = re.compile(r"(^|[\s_-])(menu|nav|navbar|header|footer|sidebar|widget-area|breadcrumbs?|toc|ez-toc|related|popup|modal)([\s_-]|$)", re.I)
SKIP = {"script", "style", "noscript", "svg", "template"}


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []  # (tag, is_chrome, is_skip)
        self.title = ""
        self.meta = {}
        self.heads = []
        self.links = []
        self.jsonld = []
        self.words = 0
        self.contacts = set()
        self._cur_h = None
        self._cur_a = None
        self._buf = []
        self._in_title = False
        self._in_ld = False

    @property
    def chrome(self):
        return any(c for _, c, _ in self.stack)

    @property
    def skip(self):
        return any(s for _, _, s in self.stack)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "meta":
            k = (a.get("name") or a.get("property") or "").lower()
            if k:
                self.meta[k] = a.get("content") or ""
        if tag == "link" and a.get("rel") == "canonical":
            self.meta["canonical"] = a.get("href", "")
        if tag in VOID:
            return
        cls = (a.get("class") or "") + " " + (a.get("id") or "")
        chrome = tag in CHROME_TAGS or (tag not in ("html", "body") and bool(CHROME_CLS.search(cls)))  # class của body mô tả cả trang
        self.stack.append((tag, chrome, tag in SKIP))
        if tag == "title":
            self._in_title = True
        if tag == "script" and "ld+json" in (a.get("type") or ""):
            self._in_ld, self._buf = True, []
        if tag in ("h1", "h2", "h3") and not self.chrome_outside_main():
            self._cur_h = [tag, []]
        if tag == "a" and re.match(r"(?i)(tel|mailto|https?://(zalo\.me|m\.me|www\.facebook\.com))", a.get("href") or ""):
            self.contacts.add(a["href"].strip())
        if tag == "a" and a.get("href"):
            self._cur_a = [a["href"], [], self.chrome, a.get("rel") or ""]

    def chrome_outside_main(self):
        return False  # giữ mọi H1–H3; vùng khung được đánh dấu ở link/chữ

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False
        if tag == "script" and self._in_ld:
            self._in_ld = False
            self.jsonld.append("".join(self._buf))
        if self._cur_h and tag == self._cur_h[0]:
            t = " ".join(" ".join(self._cur_h[1]).split())
            if t:
                self.heads.append((tag, t))
            self._cur_h = None
        if tag == "a" and self._cur_a:
            self._cur_a[1] = " ".join(" ".join(self._cur_a[1]).split())
            self.links.append(self._cur_a)
            self._cur_a = None
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                del self.stack[i:]
                break

    def handle_data(self, d):
        if self._in_title:
            self.title += d
        if self._in_ld:
            self._buf.append(d)
            return
        if self.skip:
            return
        if self._cur_h:
            self._cur_h[1].append(d)
        if self._cur_a:
            self._cur_a[1].append(d)
        if not self.chrome:
            self.words += len(re.findall(r"\w+", d))


def schema_types(blobs):
    types = set()

    def walk(o):
        if isinstance(o, dict):
            t = o.get("@type")
            for x in (t if isinstance(t, list) else [t]):
                if isinstance(x, str):
                    types.add(x)
            for v in o.values():
                walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)
    for b in blobs:
        try:
            walk(json.loads(b))
        except ValueError:
            types.add("(JSON-LD lỗi)")
    return sorted(types)


def names_in(blobs):
    """Tên Organization/Person/WebSite/brand trong JSON-LD."""
    out = set()

    def walk(o):
        if isinstance(o, dict):
            t = o.get("@type")
            t = t if isinstance(t, list) else [t]
            if any(x in ("Organization", "Person", "WebSite", "RealEstateAgent", "LocalBusiness", "Brand") for x in t):
                for k in ("name", "alternateName", "telephone", "email", "slogan", "jobTitle"):
                    if isinstance(o.get(k), str):
                        out.add(f"{k}={o[k]}")
            for v in o.values():
                walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)
    for b in blobs:
        try:
            walk(json.loads(b))
        except ValueError:
            pass
    return out


def norm(href, page_url, host):
    u = up.urljoin(page_url, href.strip())
    p = up.urlparse(u)
    if p.scheme not in ("http", "https") or p.netloc.lower().removeprefix("www.") != host:
        return None
    return up.urlunparse((p.scheme, p.netloc.lower(), p.path or "/", "", p.query, ""))


# ---------- phân loại ----------

RULES = [  # (loại, regex trên slug) – thứ tự = ưu tiên
    ("trang hệ thống", r"^(lien-he|gioi-thieu|ve-chung-toi|chinh-sach-bao-mat|dieu-khoan.*|tuyen-dung|sitemap|tac-gia|author|blog|tin-tuc)$"),
    ("mặt bằng", r"mat-bang"),
    ("giá bán / bảng giá", r"^gia-ban|(^|-)bang-gia(-|$)|^gia-(can|nha|biet|shop)"),
    ("tiến độ", r"^tien-do|-tien-do-"),
    ("pháp lý", r"phap-ly|so-hong|so-do"),
    ("chính sách bán hàng", r"chinh-sach-ban|thanh-toan|uu-dai|chiet-khau|ho-tro-vay|lai-suat"),
    ("tiện ích", r"tien-ich|vinschool|vinmec|vincom|vinwonders|golf|cong-vien|truong-hoc|benh-vien|clubhouse|be-boi"),
    ("vị trí", r"^vi-tri"),
    ("chủ đầu tư", r"chu-dau-tu"),
    ("so sánh", r"so-sanh|-hay-|-voi-cac-"),
    ("hạ tầng / quy hoạch", r"quy-hoach|ha-tang|cao-toc|metro|vanh-dai|quoc-lo|(^|-)cau-|duong-|san-bay|khoi-cong|len-thanh-pho"),
    ("loại căn", r"can-ho|biet-thu|shophouse|nha-pho|penthouse|duplex|studio|(^|-)\dpn(-|$)|lien-ke|dinh-thu|villa|song-lap|don-lap|thap-tang|nha-vuon|condotel|officetel|dat-nen|townhouse|chung-cu|loai-hinh"),
    ("phân khu / tòa", r"phan-khu|(^|-)toa-|(^|-)zone(-|$)"),
    ("phân tích đầu tư / nhu cầu", r"co-nen|dau-tu|cho-thue|thanh-khoan|loi-nhuan|an-cu|phu-hop|tang-gia|gia-tri|nen-mua|khach-thue|mo-ban"),
]


def classify(url, src):
    path = up.urlparse(url).path.strip("/")
    if not path:
        return "trang chủ"
    segs = path.split("/")
    if src.startswith("category") or segs[0] in ("category", "danh-muc", "chuyen-muc"):
        return "chuyên mục"
    if src.startswith(("post_tag", "tag")) or segs[0] == "tag":
        return "thẻ"
    if src.startswith("author") or segs[0] == "author":
        return "tác giả"
    slug = segs[-1]
    for name, rx in RULES:
        if re.search(rx, slug):
            return name
    return {"post": "bài viết khác", "page": "trang khác"}.get(src, f"khác ({src})")


# ---------- main ----------

def crawl_home(base, host, rob, cache):
    """Không có sitemap: BFS từ trang chủ, sâu 2, tối đa 100 URL."""
    seen, q, rows = {base + "/"}, [(base + "/", 0)], []
    while q and len(rows) < 100:
        url, d = q.pop(0)
        if not rob.can_fetch(UA, url):
            continue
        code, body = fetch(url, cache)
        rows.append((url, "", "crawl"))
        if d >= 2 or code != 200:
            continue
        p = Page()
        p.feed(body.decode("utf-8", "replace"))
        for href, *_ in p.links:
            n = norm(href, url, host)
            if n and n not in seen and not re.search(r"\.(jpe?g|png|webp|gif|pdf|zip|xml)$", n, re.I):
                seen.add(n)
                q.append((n, d + 1))
    return rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("domain")
    ap.add_argument("--cache", default="/tmp/velis-crawl")
    a = ap.parse_args()
    host = a.domain.lower().removeprefix("www.")
    base = "https://" + host
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), host)
    cache = os.path.join(a.cache, host)
    os.makedirs(out, exist_ok=True)

    code, robots = fetch(base + "/robots.txt", cache)
    robots = robots.decode("utf-8", "replace") if code == 200 else ""
    with open(os.path.join(out, "robots.txt"), "w", encoding="utf-8") as f:
        f.write(robots)
    rob = rp.RobotFileParser()
    rob.parse(robots.splitlines())

    rows = read_sitemaps(base, robots, cache, out) or crawl_home(base, host, rob, cache)
    seen, recs = set(), []
    for url, lastmod, src in rows:
        if url in seen:
            continue
        seen.add(url)
        recs.append({"url": url, "slug": up.urlparse(url).path.strip("/").split("/")[-1] or "/",
                     "type": classify(url, src), "lastmod": lastmod[:10], "src": src, "allowed": rob.can_fetch(UA, url)})
    with open(os.path.join(out, "urls.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["url", "slug", "loại trang", "lastmod"])
        for r in recs:
            w.writerow([r["url"], r["slug"], r["type"], r["lastmod"]])

    # mẫu: mỗi loại tối đa 5, ưu tiên lastmod mới nhất
    by_type = collections.defaultdict(list)
    for r in recs:
        by_type[r["type"]].append(r)
    pages, brand = [], {"contacts": set(), "names": set(), "site": set()}
    for t, lst in sorted(by_type.items()):
        for r in sorted(lst, key=lambda r: r["lastmod"], reverse=True)[:MAX_PER_TYPE]:
            if not r["allowed"]:
                pages.append({"url": r["url"], "type": t, "skipped": "robots.txt Disallow"})
                continue
            code, body = fetch(r["url"], cache)
            p = Page()
            p.feed(body.decode("utf-8", "replace"))
            links = []
            for href, text, chrome, rel in p.links:
                n = norm(href, r["url"], host)
                if n and n.rstrip("/") != r["url"].rstrip("/"):  # bỏ link tự trỏ (skip-link, neo)
                    links.append({"to": n, "anchor": text, "zone": "khung" if chrome else "nội dung", "rel": rel})
            brand["contacts"] |= p.contacts
            brand["names"] |= names_in(p.jsonld)
            brand["site"].add(p.meta.get("og:site_name", "") + " / " + p.meta.get("author", "") + " / " + p.meta.get("twitter:data1", ""))
            pages.append({"url": r["url"], "type": t, "http": code, "title": " ".join(p.title.split()),
                          "description": p.meta.get("description", ""), "canonical": p.meta.get("canonical", ""),
                          "robots": p.meta.get("robots", ""), "headings": p.heads, "words": p.words,
                          "schema": schema_types(p.jsonld), "links": links,
                          "note": "có thể cần JavaScript (gần như không có chữ)" if code == 200 and p.words < 50 else ""})
    with open(os.path.join(out, "pages.json"), "w", encoding="utf-8") as f:
        json.dump(pages, f, ensure_ascii=False, indent=1)

    write_structure(out, host, recs, by_type, pages)
    write_links(out, host, recs, pages)
    # chỉ in ra để điền danh sách cấm trong content/guide/rules.md – không lưu file
    for k, v in brand.items():
        print(f"[brand:{k}]", " | ".join(sorted(v))[:3000])
    print(f"{host}: {len(recs)} URL, {len(by_type)} loại, {len(pages)} trang mẫu")


def write_structure(out, host, recs, by_type, pages):
    L = [f"# {host} – cấu trúc URL (tự sinh bởi _crawler.py)", "",
         f"Tổng {len(recs)} URL từ sitemap. Ngày crawl: {time.strftime('%Y-%m-%d')}.", "",
         "| Loại trang | Số URL | Ví dụ slug |", "|---|---:|---|"]
    for t, lst in sorted(by_type.items(), key=lambda kv: -len(kv[1])):
        L.append(f"| {t} | {len(lst)} | `{lst[0]['slug']}` |")
    L += ["", "## Nguồn sitemap", "", "| Sitemap | Số URL |", "|---|---:|"]
    for s, n in collections.Counter(r["src"] for r in recs).most_common():
        L.append(f"| {s} | {n} |")
    depth = collections.Counter(len(up.urlparse(r["url"]).path.strip("/").split("/")) if up.urlparse(r["url"]).path.strip("/") else 0 for r in recs)
    L += ["", "## Độ sâu thư mục URL", "", "| Số cấp | Số URL |", "|---:|---:|"] + [f"| {k} | {v} |" for k, v in sorted(depth.items())]
    years = collections.Counter(r["lastmod"][:7] for r in recs if r["lastmod"])
    L += ["", "## lastmod theo tháng (10 tháng gần nhất)", "", "| Tháng | Số URL |", "|---|---:|"] + [f"| {k} | {v} |" for k, v in sorted(years.items())[-10:]]
    L += ["", "## Trang mẫu (tối đa 5/loại)", "", "| Loại | URL | Số chữ | H2 | H3 | Schema | Ghi chú |", "|---|---|---:|---:|---:|---|---|"]
    for p in pages:
        if "skipped" in p:
            L.append(f"| {p['type']} | {p['url']} | – | – | – | – | bỏ qua: {p['skipped']} |")
            continue
        h = collections.Counter(t for t, _ in p["headings"])
        L.append(f"| {p['type']} | {p['url']} | {p['words']} | {h['h2']} | {h['h3']} | {', '.join(p['schema'])} | {p['note'] or p['http']} |")
    L += ["", "Chi tiết title, meta description, H1–H3, link: `pages.json`."]
    with open(os.path.join(out, "structure.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(L) + "\n")


def write_links(out, host, recs, pages):
    key = lambda u: u.split("://", 1)[-1].rstrip("/")  # sitemap có thể khai http:// trong khi link dùng https://
    tmap = {key(r["url"]): r["type"] for r in recs}
    tt = lambda u: tmap.get(key(u), "ngoài sitemap")
    ok = [p for p in pages if "links" in p]
    L = [f"# {host} – liên kết nội bộ (tự sinh, trên {len(ok)} trang mẫu)", "",
         "`khung` = link trong header/nav/footer/sidebar/menu/mục lục; `nội dung` = link trong thân bài.", ""]
    for zone in ("nội dung", "khung"):
        c = collections.Counter(l["to"] for p in ok for l in p["links"] if l["zone"] == zone)
        L += [f"## Trang được trỏ đến nhiều nhất – vùng {zone}", "", "| URL đích | Loại | Số link |", "|---|---|---:|"]
        L += [f"| {u} | {tt(u)} | {n} |" for u, n in c.most_common(15)] + [""]
    c = collections.Counter(l["anchor"].lower() for p in ok for l in p["links"] if l["zone"] == "nội dung" and l["anchor"])
    L += ["## Anchor hay dùng trong thân bài (top 25)", "", "| Anchor | Số lần |", "|---|---:|"]
    L += [f"| {a[:80]} | {n} |" for a, n in c.most_common(25)] + [""]
    m = collections.Counter((p["type"], tt(l["to"])) for p in ok for l in p["links"] if l["zone"] == "nội dung")
    L += ["## Loại trang → loại trang (chỉ link trong thân bài)", "", "| Từ | Đến | Số link |", "|---|---|---:|"]
    L += [f"| {a} | {b} | {n} |" for (a, b), n in m.most_common(30)] + [""]
    per = [(p["url"], sum(l["zone"] == "nội dung" for l in p["links"]), len(p["links"])) for p in ok]
    L += ["## Số link mỗi trang mẫu", "", "| Trang | Link thân bài | Tổng link nội bộ |", "|---|---:|---:|"]
    L += [f"| {u} | {a} | {b} |" for u, a, b in per]
    with open(os.path.join(out, "internal-links.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(L) + "\n")


def _selftest():
    p = Page()
    p.feed('<header><a href="/a">A</a></header><main><h1>X</h1><p>một hai ba</p><a href="/b">B c</a>'
           '<script type="application/ld+json">{"@graph":[{"@type":"Article"},{"@type":["Place","Thing"]}]}</script></main>')
    assert p.heads == [("h1", "X")], p.heads
    assert [(h, t, c) for h, t, c, _ in p.links] == [("/a", "A", True), ("/b", "B c", False)], p.links
    assert schema_types(p.jsonld) == ["Article", "Place", "Thing"]
    assert p.words == 6, p.words  # X + một hai ba + B c
    q = Page()
    q.feed('<div class="elementor-widget elementor-widget-text-editor"><p>a b</p></div><div class="elementor-nav-menu"><p>c</p></div>')
    assert q.words == 2, q.words  # widget Elementor là nội dung, nav-menu là khung
    b = Page()
    b.feed('<body class="has-header-menu"><p>a b c</p></body>')
    assert b.words == 3, b.words
    assert classify("https://x.vn/mat-bang-the-opus/", "page") == "mặt bằng"
    assert classify("https://x.vn/", "page") == "trang chủ"
    assert classify("https://x.vn/category/tin-tuc/", "category") == "chuyên mục"
    assert norm("/a#b", "https://x.vn/p/", "x.vn") == "https://x.vn/a"
    assert norm("https://y.vn/a", "https://x.vn/", "x.vn") is None


if __name__ == "__main__":
    _selftest()
    try:
        main()
    except Blocked as e:
        sys.exit(f"DỪNG – bị chặn mạng: {e}")
