"""Convert WPBakery / The7 / Ultimate Addons content to standard WordPress blocks – FORMAT ONLY, the words stay the same.

What happens to each piece:
- structural shortcodes (vc_section/row/column/…_inner/column_text, ultimate_ctation wrapper) are unwrapped, their inner
  HTML converted; dynamic listings without text (dt_blog_list, dt_blog_masonry, dt_carousel, stat_counter in hidden
  pages, contact-form-7, vc_empty_space) are dropped – the theme renders listings and the form itself;
- vc_single_image → core/image (alt and caption from the Media Library); vc_separator → core/separator;
  vc_toggle → core/details (FAQ); vc_video → core/embed (YouTube, click-to-load in the theme); dt_default_button →
  core/buttons; dt_fancy_title → core/heading; ultimate_icon_list → core/list; vc_raw_html → its decoded HTML;
- HTML → paragraph, heading, list (+ "• …" paragraph runs become a real list), table, image, quote blocks; inline
  formatting kept (strong/em/links/br/sub/sup), presentation attributes dropped; Google Maps iframes → the static
  office map of the theme with a link; Easy TOC boxes dropped;
- headings: one H1 is the page title, so content H1 → H2, and no level is skipped (text untouched);
- internal links: old URLs → new URLs from data/url-map.csv (root-relative, no redirect hop).
Bracketed words that are not shortcodes ("[TRỤ CỘT]", "[số]") stay as text.
"""
import base64, csv, html, json, os, re, urllib.parse
from html.parser import HTMLParser

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
STRUCT = {'vc_section', 'vc_row', 'vc_column', 'vc_row_inner', 'vc_column_inner', 'vc_column_text', 'ultimate_ctation'}
DROP = {'dt_blog_list', 'dt_blog_masonry', 'dt_carousel', 'stat_counter', 'contact-form-7', 'vc_empty_space'}
SPECIAL = {'vc_single_image', 'vc_separator', 'vc_toggle', 'vc_video', 'dt_default_button', 'dt_fancy_title',
           'ultimate_icon_list', 'ultimate_icon_list_item', 'vc_raw_html'}
KNOWN = STRUCT | DROP | SPECIAL
CLOSING = STRUCT | {'vc_toggle', 'dt_default_button', 'ultimate_icon_list', 'ultimate_icon_list_item', 'vc_raw_html'}
BLOCK_TAGS = {'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'table', 'figure', 'blockquote', 'div', 'section',
              'iframe', 'hr', 'img', 'pre', 'dl'}
INLINE_KEEP = {'a', 'strong', 'em', 'br', 'sub', 'sup', 'code', 'u', 's', 'mark'}
VOID = {'br', 'img', 'hr', 'input', 'source', 'meta', 'link', 'wbr', 'col'}
BULLET = re.compile(r'^\s*(?:[•●▪◦✓✔➤►\-–+])\s+')
SITE = re.compile(r'^https?://(?:staging\.)?velisrealty\.vn', re.I)


# ---------- shortcodes ----------

def attrs_of(s):
    return {k: v1 if v1 is not None else v2 for k, v1, v2 in re.findall(r'([\w-]+)\s*=\s*(?:"([^"]*)"|(\S+))', s or '')}


def parse_shortcodes(raw):
    """Tree of ('text', str) / ('sc', name, attrs, children). Only known shortcode names are parsed."""
    tok = re.compile(r'\[(/?)([\w-]+)((?:\s[^\]]*)?)\]')
    root = ('sc', '_root', {}, [])
    stack = [root]
    pos = 0
    for m in tok.finditer(raw):
        closing, name, rest = m.group(1), m.group(2), m.group(3)
        if name not in KNOWN:
            continue
        if m.start() > pos:
            stack[-1][3].append(('text', raw[pos:m.start()]))
        pos = m.end()
        if closing:
            for i in range(len(stack) - 1, 0, -1):
                if stack[i][1] == name:
                    del stack[i:]
                    break
            continue
        node = ('sc', name, attrs_of(rest), [])
        stack[-1][3].append(node)
        if name in CLOSING and not rest.rstrip().endswith('/'):
            stack.append(node)
    if pos < len(raw):
        stack[-1][3].append(('text', raw[pos:]))
    return root


# ---------- small DOM ----------

class Node:
    def __init__(self, tag, attrs=None, parent=None):
        self.tag, self.attrs, self.children, self.parent = tag, dict(attrs or {}), [], parent


class TreeBuilder(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node('root')
        self.cur = self.root

    def handle_starttag(self, tag, attrs):
        n = Node(tag, attrs, self.cur)
        self.cur.children.append(n)
        if tag not in VOID:
            self.cur = n

    def handle_startendtag(self, tag, attrs):
        self.cur.children.append(Node(tag, attrs, self.cur))

    def handle_endtag(self, tag):
        n = self.cur
        while n is not self.root and n.tag != tag:
            n = n.parent
        if n is not self.root:
            self.cur = n.parent

    def handle_data(self, data):
        self.cur.children.append(data)


def parse_html(s):
    b = TreeBuilder()
    b.feed(s)
    b.close()
    return b.root


def text_of(n):
    if isinstance(n, str):
        return n
    if n.tag in ('script', 'style'):
        return ''
    return ''.join(text_of(c) for c in n.children)


def esc(s):
    return html.escape(s, quote=False)


class Ctx:
    """Per-document context: media lookup, URL map, heading levels."""

    def __init__(self, media, urlmap, office_map=None):
        self.media = media          # list of {id,url,alt,caption,sizes}
        self.urlmap = urlmap        # old path -> new path ('' = 410)
        self.office_map = office_map
        self.by_file = {}
        for m in media:
            for u in [m['url']] + list(m.get('sizes', {}).values()):
                self.by_file[os.path.basename(urllib.parse.urlparse(u).path).lower()] = m
            self.by_file.setdefault(self.base(m['url']), m)
        self.by_id = {m['id']: m for m in media}
        self.prev_level = 1
        self.links_changed = 0

    @staticmethod
    def base(u):
        return re.sub(r'(-\d+x\d+|-scaled)+(?=\.\w+$)', '', os.path.basename(urllib.parse.urlparse(u).path).lower())

    def media_for(self, src):
        f = os.path.basename(urllib.parse.urlparse(src).path).lower()
        return self.by_file.get(f) or self.by_file.get(self.base(src))

    def link(self, href):
        """Old internal URL → new root-relative URL (one step, no redirect)."""
        if not href or not SITE.match(href):
            return href
        u = urllib.parse.urlparse(href)
        path = u.path if u.path.endswith('/') or '.' in u.path.rsplit('/', 1)[-1] else u.path + '/'
        new = self.urlmap.get(path)
        out = (new if new else path) + (('#' + u.fragment) if u.fragment else '')
        if new is not None and new != path:
            self.links_changed += 1
        return out

    def level(self, lvl):
        lvl = max(2, lvl)                      # the page title is the only H1
        lvl = min(lvl, self.prev_level + 1)    # never skip a level
        self.prev_level = lvl
        return lvl


# ---------- inline ----------

def inline(nodes, ctx):
    out = []
    for n in nodes:
        if isinstance(n, str):
            out.append(esc(n))
            continue
        t = n.tag
        if t in ('b', 'strong') or (t == 'span' and re.search(r'font-weight:\s*(bold|[6-9]00)', n.attrs.get('style', ''))):
            inner = inline(n.children, ctx)
            out.append('<strong>%s</strong>' % inner if inner.strip() else inner)
        elif t in ('i', 'em') or (t == 'span' and 'italic' in n.attrs.get('style', '')):
            inner = inline(n.children, ctx)
            out.append('<em>%s</em>' % inner if inner.strip() else inner)
        elif t == 'a':
            href = ctx.link(n.attrs.get('href', ''))
            extra = ''
            if n.attrs.get('target') == '_blank':
                extra = ' target="_blank" rel="noreferrer noopener"'
            out.append('<a href="%s"%s>%s</a>' % (html.escape(href or '', quote=True), extra, inline(n.children, ctx)))
        elif t == 'br':
            out.append('<br>')
        elif t in INLINE_KEEP:
            out.append('<%s>%s</%s>' % (t, inline(n.children, ctx), t))
        elif t in ('script', 'style', 'img', 'iframe'):
            continue
        else:
            out.append(inline(n.children, ctx))
    return ''.join(out)


def clean_inline(s):
    s = re.sub(r'(<br>\s*)+$', '', s.strip())
    s = re.sub(r'^(\s*<br>)+', '', s)
    s = s.replace('\xa0', ' ') if s.replace('\xa0', '').strip() == '' else s
    return s.strip()


# ---------- blocks ----------

def b_paragraph(h):
    return '<!-- wp:paragraph -->\n<p>%s</p>\n<!-- /wp:paragraph -->' % h


def b_heading(h, lvl):
    a = '' if lvl == 2 else ' {"level":%d}' % lvl
    return '<!-- wp:heading%s -->\n<h%d class="wp-block-heading">%s</h%d>\n<!-- /wp:heading -->' % (a, lvl, h, lvl)


def b_list(items, ordered=False):
    tag = 'ol' if ordered else 'ul'
    a = ' {"ordered":true}' if ordered else ''
    li = ''.join('<!-- wp:list-item -->\n<li>%s</li>\n<!-- /wp:list-item -->' % i for i in items)
    return '<!-- wp:list%s -->\n<%s class="wp-block-list">%s</%s>\n<!-- /wp:list -->' % (a, tag, li, tag)


def b_image(m, alt=None, caption=None, href=None):
    alt = (alt if alt is not None else m.get('alt', '')) or ''
    cap = caption if caption is not None else (re.sub('<[^>]+>', '', m.get('caption', '') or '').strip())
    src = m['sizes'].get('large') or m['url']
    attrs = {'id': m['id'], 'sizeSlug': 'large' if 'large' in m['sizes'] else 'full', 'linkDestination': 'custom' if href else 'none'}
    img = '<img src="%s" alt="%s" class="wp-image-%d"/>' % (html.escape(src, quote=True), html.escape(alt, quote=True), m['id'])
    if href:
        img = '<a href="%s">%s</a>' % (html.escape(href, quote=True), img)
    fig = '<figure class="wp-block-image size-%s">%s%s</figure>' % (attrs['sizeSlug'], img, ('<figcaption class="wp-element-caption">%s</figcaption>' % esc(cap)) if cap else '')
    return '<!-- wp:image %s -->\n%s\n<!-- /wp:image -->' % (json.dumps(attrs, separators=(',', ':')), fig)


def b_separator():
    return '<!-- wp:separator -->\n<hr class="wp-block-separator has-alpha-channel-opacity"/>\n<!-- /wp:separator -->'


def b_details(summary, inner_blocks):
    return '<!-- wp:details -->\n<details class="wp-block-details"><summary>%s</summary>%s</details>\n<!-- /wp:details -->' % (summary, ''.join(inner_blocks))


def b_quote(inner_blocks):
    return '<!-- wp:quote -->\n<blockquote class="wp-block-quote">%s</blockquote>\n<!-- /wp:quote -->' % ''.join(inner_blocks)


def b_buttons(label, href):
    return ('<!-- wp:buttons -->\n<div class="wp-block-buttons"><!-- wp:button -->\n<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="%s">%s</a></div>\n<!-- /wp:button --></div>\n<!-- /wp:buttons -->'
            % (html.escape(href, quote=True), label))


def b_youtube(url):
    a = {'url': url, 'type': 'video', 'providerNameSlug': 'youtube', 'responsive': True, 'className': 'wp-embed-aspect-16-9 wp-has-aspect-ratio'}
    return ('<!-- wp:embed %s -->\n<figure class="wp-block-embed is-type-video is-provider-youtube wp-block-embed-youtube wp-embed-aspect-16-9 wp-has-aspect-ratio"><div class="wp-block-embed__wrapper">\n%s\n</div></figure>\n<!-- /wp:embed -->'
            % (json.dumps(a, separators=(',', ':')), url))


def b_table(n, ctx):
    rows_head, rows_body = [], []
    for sec in n.children:
        if isinstance(sec, str):
            continue
        trs = [sec] if sec.tag == 'tr' else [r for r in sec.children if not isinstance(r, str) and r.tag == 'tr']
        for tr in trs:
            cells = [c for c in tr.children if not isinstance(c, str) and c.tag in ('td', 'th')]
            (rows_head if sec.tag == 'thead' else rows_body).append(cells)
    def row(cells, head):
        t = 'th' if head else 'td'
        return '<tr>%s</tr>' % ''.join('<%s>%s</%s>' % (t, clean_inline(inline_with_breaks(c, ctx)), t) for c in cells)
    th = '<thead>%s</thead>' % ''.join(row(r, True) for r in rows_head) if rows_head else ''
    tb = '<tbody>%s</tbody>' % ''.join(row(r, False) for r in rows_body)
    return '<!-- wp:table -->\n<figure class="wp-block-table"><table class="has-fixed-layout">%s%s</table></figure>\n<!-- /wp:table -->' % (th, tb)


def inline_with_breaks(n, ctx):
    """Cell / list item content: block children (p, div) become lines separated by <br>."""
    parts, buf = [], []
    for c in n.children:
        if not isinstance(c, str) and c.tag in ('p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'):
            if buf:
                parts.append(inline(buf, ctx)); buf = []
            parts.append(inline_with_breaks(c, ctx))
        elif not isinstance(c, str) and c.tag in ('ul', 'ol'):
            if buf:
                parts.append(inline(buf, ctx)); buf = []
            parts.extend(inline_with_breaks(li, ctx) for li in c.children if not isinstance(li, str))
        else:
            buf.append(c)
    if buf:
        parts.append(inline(buf, ctx))
    return '<br>'.join(clean_inline(p) for p in parts if clean_inline(p))


def list_items(n, ctx):
    items = []
    for li in n.children:
        if isinstance(li, str) or li.tag != 'li':
            continue
        nested = [c for c in li.children if not isinstance(c, str) and c.tag in ('ul', 'ol')]
        own = Node('li', {}, None)
        own.children = [c for c in li.children if c not in nested]
        h = clean_inline(inline_with_breaks(own, ctx))
        for sub in nested:
            h += b_list(list_items(sub, ctx), sub.tag == 'ol')
        if h:
            items.append(h)
    return items


def image_block(img, ctx, caption=None, href=None):
    m = ctx.media_for(img.attrs.get('src', ''))
    if m is None:
        return None
    return b_image(m, alt=img.attrs.get('alt') if img.attrs.get('alt') else None, caption=caption, href=href)


def blocks_from_nodes(nodes, ctx):
    """Top-level HTML nodes → blocks. Inline runs are grouped into paragraphs (blank lines split them, like wpautop)."""
    out, run = [], []

    def flush():
        if not run:
            return
        imgs = image_items(run, ctx)
        h = inline(run, ctx)
        for para in re.split(r'\n\s*\n', h):
            para = clean_inline(para.replace('\n', '<br>') if re.search(r'\S\n\S', para) else para.replace('\n', ' '))
            if para and re.sub(r'<br>|\s|&nbsp;', '', para):
                out.append(('p', para))
        out.extend(imgs)
        run.clear()

    for n in nodes:
        if isinstance(n, str) or n.tag not in BLOCK_TAGS:
            if not isinstance(n, str) and n.tag == 'span' and any(not isinstance(c, str) and c.tag in BLOCK_TAGS for c in n.children):
                flush(); out.extend(blocks_from_nodes(n.children, ctx)); continue
            run.append(n)
            continue
        flush()
        t = n.tag
        if t == 'p':
            h = clean_inline(inline(n.children, ctx))
            if h and re.sub(r'<br>|\s|&nbsp;', '', h):
                out.append(('p', h))
            out.extend(image_items(n.children, ctx))
        elif t in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6'):
            h = clean_inline(inline(n.children, ctx))
            if re.sub(r'<[^>]+>|\s|&nbsp;', '', h):
                out.append(('h', h, int(t[1])))
            out.extend(image_items(n.children, ctx))
        elif t in ('ul', 'ol'):
            items = list_items(n, ctx)
            if items:
                out.append(('raw', b_list(items, t == 'ol')))
        elif t == 'table':
            out.append(('raw', b_table(n, ctx)))
        elif t == 'img':
            b = image_block(n, ctx)
            if b:
                out.append(('raw', b))
        elif t == 'figure':
            img = find(n, 'img')
            cap = find(n, 'figcaption')
            a = find(n, 'a')
            if img:
                b = image_block(img, ctx, caption=text_of(cap).strip() if cap else None, href=ctx.link(a.attrs.get('href')) if a and find(a, 'img') else None)
                if b:
                    out.append(('raw', b))
            if find(n, 'table'):
                out.append(('raw', b_table(find(n, 'table'), ctx)))
        elif t == 'blockquote':
            inner = render(blocks_from_nodes(n.children, ctx), ctx)
            if inner:
                out.append(('raw', b_quote(inner)))
        elif t == 'hr':
            out.append(('raw', b_separator()))
        elif t == 'iframe':
            src = n.attrs.get('src', '')
            yt = re.search(r'(?:youtube\.com/embed/|youtu\.be/)([\w-]{6,})', src)
            if yt:
                out.append(('raw', b_youtube('https://youtu.be/' + yt.group(1))))
            elif 'google.com/maps' in src and ctx.office_map:
                out.append(('raw', b_image(ctx.office_map, href='https://www.google.com/maps/search/?api=1&query=' + urllib.parse.quote('Velis Realty 34 Lương Định Của, Bình Trưng'))))
        elif t in ('div', 'section', 'pre', 'dl'):
            if n.attrs.get('id') == 'ez-toc-container' or 'ez-toc' in n.attrs.get('class', ''):
                continue  # Easy TOC box: the theme builds its own table of contents
            out.extend(blocks_from_nodes(n.children, ctx))
    flush()
    return out


def desc_imgs(nodes, href=None):
    """Every <img> inside these nodes, with the link around it if any (images are hoisted out of text elements)."""
    out = []
    for n in nodes:
        if isinstance(n, str):
            continue
        if n.tag == 'img':
            out.append((n, href))
        else:
            out.extend(desc_imgs(n.children, n.attrs.get('href') if n.tag == 'a' else href))
    return out


def image_items(nodes, ctx):
    out = []
    for img, href in desc_imgs(nodes):
        b = image_block(img, ctx, href=ctx.link(href) if href else None)
        if b:
            out.append(('raw', b))
    return out


def find(n, tag):
    for c in n.children:
        if isinstance(c, str):
            continue
        if c.tag == tag:
            return c
        r = find(c, tag)
        if r:
            return r
    return None


def render(items, ctx):
    """Typed items → block markup; "• …" paragraph runs → one list; heading levels normalised."""
    out, i = [], 0
    while i < len(items):
        it = items[i]
        if it[0] == 'p' and BULLET.match(re.sub('<[^>]+>', '', it[1])):
            run = []
            while i < len(items) and items[i][0] == 'p' and BULLET.match(re.sub('<[^>]+>', '', items[i][1])):
                run.append(strip_bullet(items[i][1])); i += 1
            if len(run) >= 2:
                out.append(b_list(run)); continue
            out.append(b_paragraph(items[i - 1][1])); continue
        if it[0] == 'p':
            out.append(b_paragraph(it[1]))
        elif it[0] == 'h':
            out.append(b_heading(it[1], ctx.level(it[2])))
        else:
            out.append(it[1])
        i += 1
    return out


def strip_bullet(h):
    """Remove the leading bullet character (it becomes the list marker); keeps any markup before the text."""
    m = re.match(r'^((?:<[^>]+>)*)\s*(?:[•●▪◦✓✔➤►\-–+])\s+', h)
    return (m.group(1) + h[m.end():]) if m else h


# ---------- shortcode tree → items ----------

def items_from_tree(node, ctx):
    items = []
    for c in node[3]:
        if c[0] == 'text':
            items.extend(blocks_from_nodes(parse_html(c[1]).children, ctx))
            continue
        _, name, a, kids = c
        if name in STRUCT:
            items.extend(items_from_tree(c, ctx))
        elif name in DROP:
            continue
        elif name == 'vc_separator':
            items.append(('raw', b_separator()))
        elif name == 'vc_single_image':
            m = ctx.by_id.get(int(a.get('image', '0') or 0))
            if m:
                items.append(('raw', b_image(m, href=ctx.link(a.get('link')) if a.get('onclick') == 'custom_link' and a.get('link') else None)))
        elif name == 'vc_toggle':
            inner = render(items_from_tree(c, ctx), ctx)
            items.append(('raw', b_details(esc(html.unescape(a.get('title', ''))), inner)))
        elif name == 'vc_video':
            yt = re.search(r'(?:v=|youtu\.be/|embed/)([\w-]{6,})', a.get('link', ''))
            if yt:
                items.append(('raw', b_youtube('https://youtu.be/' + yt.group(1))))
        elif name == 'dt_default_button':
            label = clean_inline(inline(parse_html(''.join(k[1] for k in kids if k[0] == 'text')).children, ctx))
            href = urllib.parse.unquote(re.sub(r'^url:', '', a.get('link', '')).split('|')[0])
            if label:
                items.append(('raw', b_buttons(label, ctx.link(href) or '#tu-van')))
        elif name == 'dt_fancy_title':
            lvl = int((a.get('title_size') or 'h2').lstrip('h') or 2)
            items.append(('h', esc(html.unescape(a.get('title', ''))), lvl))
        elif name == 'ultimate_icon_list':
            li = [clean_inline(inline_with_breaks(parse_html(''.join(x[1] for x in k[3] if x[0] == 'text')), ctx)) for k in kids if k[0] == 'sc' and k[1] == 'ultimate_icon_list_item']
            if li:
                items.append(('raw', b_list([x for x in li if x])))
        elif name == 'vc_raw_html':
            body = ''.join(k[1] for k in kids if k[0] == 'text').strip()
            try:
                body = urllib.parse.unquote(base64.b64decode(body).decode('utf-8'))
            except Exception:
                pass
            items.extend(blocks_from_nodes(parse_html(body).children, ctx))
    return items


def convert(raw, ctx):
    ctx.prev_level = 1
    return '\n\n'.join(render(items_from_tree(parse_shortcodes(raw), ctx), ctx)) + '\n'


# ---------- measurements ----------

def words(text):
    return re.findall(r'[0-9A-Za-zÀ-ỹĐđ]+(?:[.,/-][0-9A-Za-zÀ-ỹĐđ]+)*', text)


def source_text(raw):
    """Visible words of the original: shortcode tags removed, raw HTML blocks decoded, dropped listings have no text."""
    def dec(m):
        try:
            return urllib.parse.unquote(base64.b64decode(m.group(1).strip()).decode('utf-8'))
        except Exception:
            return m.group(1)
    raw = re.sub(r'\[vc_raw_html[^\]]*\](.*?)\[/vc_raw_html\]', dec, raw, flags=re.S)
    raw = re.sub(r'\[dt_fancy_title[^\]]*title="([^"]*)"[^\]]*\]', r' \1 ', raw)
    raw = re.sub(r'\[vc_toggle[^\]]*title="([^"]*)"[^\]]*\]', r' \1 ', raw)
    raw = re.sub(r'\[/?(%s)\b[^\]]*\]' % '|'.join(map(re.escape, KNOWN)), ' ', raw)
    raw = re.sub(r'<(script|style)\b.*?</\1>', ' ', raw, flags=re.S)
    return html.unescape(re.sub(r'<[^>]+>', ' ', raw))


def block_text(markup):
    t = re.sub(r'<!--.*?-->', ' ', markup, flags=re.S)
    t = re.sub(r'<figure class="wp-block-embed[^>]*>.*?</figure>', ' ', t, flags=re.S)
    return html.unescape(re.sub(r'<[^>]+>', ' ', t))


def stats(raw, markup):
    w0, w1 = len(words(source_text(raw))), len(words(block_text(markup)))
    return {
        'words_before': w0, 'words_after': w1, 'diff_pct': round(100 * (w1 - w0) / w0, 2) if w0 else 0.0,
        'images': markup.count('<!-- wp:image'), 'links': len(re.findall(r'<a href=', markup)),
        'headings': len(re.findall(r'<!-- wp:heading', markup)), 'details': markup.count('<!-- wp:details'),
        'shortcodes_left': len(re.findall(r'\[/?(vc_|ult|dt_|ultimate_|stat_counter|contact-form-7)', markup)),
    }


def load_urlmap():
    m = {}
    for r in csv.DictReader(open(os.path.join(ROOT, 'data', 'url-map.csv'), encoding='utf-8')):
        m[r['url_cu']] = r['url_moi'] if r['hanh_dong'] != '410' else ''
    return m
