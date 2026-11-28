"""Featured image kind of every blog post, judged by eye from a contact sheet (2026-11-04). Writes
data/post-image-kinds.csv + docs/ANH-CAN-THAY.md; --write stores velis_image_kind on STAGING.
du-an = project rendering / construction / plan; khu-vuc = Vietnamese area, infrastructure, map, other VN projects;
minh-hoa = generic illustration (interior, office, chart, fantasy); nuoc-ngoai = foreign people or streets.
Usage: python3 -I tools/post_image_kinds.py feat.tsv [--write]  (feat.tsv: id, date, path, media id, file, thumb, alt)"""
import csv, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KIND = {}
for kind, ids in {
    'du-an': '20399 20396 20391 20388 20384 20354 20339 20326 20289 20278 20274 20270 20221 20216 20213 20210 20205 20193 20171 20167 20160 '
             '20144 20139 20042 20023 20016 20007 19992 19927 19894 19885 19879 19876 19871 19848',
    'khu-vuc': '20468 20458 20454 20411 20135 20106 20103 20098 20005 19996 19905 19898 19888 19874 19863 19684 19682 19676 19712 19715 19718 19721 19725 19669',
    'minh-hoa': '20449 20446 20406 20330 20315 20312 20306 20303 20300 20292 20224 20199 20195 20190 20177 20164 20156 20152 20147 20129 20125 20113 '
                '20110 20037 20031 20026 20013 20000 19920 19917 19913 19908 19901 19694',
    'nuoc-ngoai': '20349 20346 20342 20334 20296 20202 20174 20132 19923',
}.items():
    for i in ids.split():
        KIND[int(i)] = kind
LABEL = {'minh-hoa': 'minh họa chung (nội thất, văn phòng, biểu đồ, giả tưởng)', 'nuoc-ngoai': 'người / phố nước ngoài'}


def main(src, write):
    rows = [l.rstrip('\n').split('\t') for l in open(src, encoding='utf-8') if l.strip()]
    missing = [r[0] for r in rows if int(r[0]) not in KIND]
    assert not missing, 'chưa phân loại: %s' % missing
    with open(os.path.join(ROOT, 'data', 'post-image-kinds.csv'), 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f, lineterminator='\n')
        w.writerow(['id', 'url', 'anh', 'loai_anh'])
        for r in rows:
            w.writerow([r[0], r[2], r[4], KIND[int(r[0])]])
    bad = [r for r in rows if KIND[int(r[0])] in LABEL]
    md = ['# Ảnh đại diện cần thay', '', 'Lập 2026-11-04 (giai đoạn 4, vòng "ấn tượng đầu tiên"). Ảnh đại diện của bài không phải ảnh dự án hay Việt Nam.',
          'Thay ở giai đoạn nội dung bằng phối cảnh / ảnh công trình thật của dự án trong bài; sau khi thay, đổi ô "Ảnh đại diện là"',
          '(velis-data) thành "Ảnh dự án". Trang chủ chỉ chọn bài có ảnh dự án. Phân loại đủ 102 bài: `data/post-image-kinds.csv`.', '',
          'Tổng: %d bài (%d minh họa chung, %d người/phố nước ngoài).' % (len(bad), sum(KIND[int(r[0])] == 'minh-hoa' for r in bad), sum(KIND[int(r[0])] == 'nuoc-ngoai' for r in bad)), '',
          '| Bài | Ảnh hiện tại | Vì sao cần thay |', '|---|---|---|']
    md += ['| %s | `%s` | %s |' % (r[2], r[4], LABEL[KIND[int(r[0])]]) for r in sorted(bad, key=lambda r: KIND[int(r[0])], reverse=True)]
    open(os.path.join(ROOT, 'docs', 'ANH-CAN-THAY.md'), 'w', encoding='utf-8').write('\n'.join(md) + '\n')
    print(len(rows), 'bài ·', len(bad), 'ảnh cần thay')
    if write:
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        from import_staging import api
        for r in rows:
            api('POST', 'posts/%s' % r[0], {'meta': {'velis_image_kind': KIND[int(r[0])]}})
        print('đã ghi')


if __name__ == '__main__':
    main(sys.argv[1], '--write' in sys.argv)
