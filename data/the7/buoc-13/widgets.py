# Bản đã chạy trên staging 2026-11-13 (từ thư mục scratch, cần rest.py: phiên REST staging bằng WP_USER / WP_APP_PASSWORD).
# Default Footer (sidebar_2): text-2 (địa chỉ) + custom_html-2 (form Liên hệ) → Tiện ích không sử dụng (không xóa);
# 4 cột mới: HTML tùy chỉnh (Velis Realty) · Khối (Dự án: Bài viết mới nhất chuyên mục Dự án, 6 bài) · Menu (Về Velis) · Khối (Kết nối: biểu tượng MXH).
# Khối liên hệ cuối trang (velis-lien-he-cuoi, theme con 1.8.0): 1 HTML tùy chỉnh (chữ + form CF7 19582).
import sys,json;sys.path.insert(0,'b12');from rest import s,S,get
MAP='https://www.google.com/maps/search/?api=1&amp;query=10.7909975,106.7442593'
C1=f'''<div class="velis-foot-brand">
<p class="velis-foot-logo"><a href="/" aria-label="Velis Realty – Trang chủ"><img src="/wp-content/uploads/2026/11/velis-logo-trang-40.png" srcset="/wp-content/uploads/2026/11/velis-logo-trang-80.png 2x" width="174" height="40" alt="Velis Realty" loading="lazy"></a></p>
<p>Sàn giao dịch bất động sản cao cấp chuyên tư vấn các dự án Vinhomes, Sun Group.</p>
<p class="velis-foot-tel"><a href="tel:0911237979">0911 237 979</a></p>
<ul class="velis-foot-info">
<li><a href="https://zalo.me/0911237979" target="_blank" rel="noopener">Zalo 0911 237 979</a></li>
<li><a href="mailto:lienhe@velisrealty.vn">lienhe@velisrealty.vn</a></li>
<li><span>34 Lương Định Của, Phường Bình Trưng, TP. Hồ Chí Minh</span> <a href="{MAP}" target="_blank" rel="noopener">Xem bản đồ</a></li>
<li><span>Giờ làm việc: 08:00–21:00 hằng ngày</span></li>
</ul>
</div>'''
C2='''<!-- wp:paragraph {"className":"widget-title"} -->
<p class="widget-title">Dự án</p>
<!-- /wp:paragraph -->

<!-- wp:latest-posts {"categories":[{"id":34,"value":"Dự án"}],"postsToShow":6,"order":"desc","orderBy":"date","className":"velis-foot-links"} /-->

<!-- wp:paragraph {"className":"velis-foot-more"} -->
<p class="velis-foot-more"><a href="/du-an/">Tất cả dự án →</a></p>
<!-- /wp:paragraph -->'''
SOC=[('facebook','https://www.facebook.com/velisrealty'),('youtube','https://www.youtube.com/@velisrealty'),('tiktok','https://www.tiktok.com/@velisrealty'),
     ('instagram','https://www.instagram.com/velisrealty/'),('linkedin','https://www.linkedin.com/in/velisrealty'),('pinterest','https://www.pinterest.com/velisrealty'),('x','https://x.com/velisrealty')]
C4='''<!-- wp:paragraph {"className":"widget-title"} -->
<p class="widget-title">Kết nối</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Theo dõi phân tích thị trường mới nhất</p>
<!-- /wp:paragraph -->

<!-- wp:social-links {"openInNewTab":true,"className":"velis-foot-social is-style-logos-only"} -->
<ul class="wp-block-social-links velis-foot-social is-style-logos-only">''' + ''.join(f'<!-- wp:social-link {{"url":"{u}","service":"{k}"}} /-->' for k,u in SOC) + '''</ul>
<!-- /wp:social-links -->'''
PRE='''<div class="velis-prefoot">
<div class="velis-prefoot__text">
<p class="velis-eyebrow">Tư vấn trực tiếp</p>
<h2>Nhận tư vấn từ Velis Realty</h2>
<p>Để lại họ tên và số điện thoại, chuyên viên Velis Realty gọi lại trong giờ làm việc (08:00–21:00 hằng ngày).</p>
<p class="velis-prefoot__tel"><a href="tel:0911237979">0911 237 979</a></p>
<p class="velis-prefoot__zalo">Hoặc nhắn <a href="https://zalo.me/0911237979" target="_blank" rel="noopener">Zalo</a></p>
</div>
<div class="velis-prefoot__form">[contact-form-7 id="19582" title="Liên Hệ"]</div>
</div>'''
mode=sys.argv[1]
if mode=='footer':
    for wid in ('text-2','custom_html-2'):
        r=s.post(S+f'wp/v2/widgets/{wid}',json={'sidebar':'wp_inactive_widgets'}); print(wid,'→ inactive',r.status_code)
    new=[('custom_html',{'raw':{'title':'','content':C1}}),('block',{'raw':{'content':C2}}),('nav_menu',{'raw':{'title':'Về Velis','nav_menu':58}}),('block',{'raw':{'content':C4}})]
    for idb,inst in new:
        r=s.post(S+'wp/v2/widgets',json={'id_base':idb,'sidebar':'sidebar_2','instance':inst}); print(idb,r.status_code,r.json().get('id'),str(r.json())[:200] if r.status_code>=300 else '')
if mode=='pre':
    r=s.post(S+'wp/v2/widgets',json={'id_base':'custom_html','sidebar':'velis-lien-he-cuoi','instance':{'raw':{'title':'','content':PRE}}}); print('pre',r.status_code,r.json().get('id'),str(r.json())[:300])
for sb in ('sidebar_2','velis-lien-he-cuoi','wp_inactive_widgets'):
    try: print(sb,[w['id'] for w in get(f'wp/v2/widgets?sidebar={sb}')])
    except Exception as e: print(sb,e)
