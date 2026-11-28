# Bản đã chạy trên staging 2026-11-13 (từ thư mục scratch, cần rest.py: phiên REST staging bằng WP_USER / WP_APP_PASSWORD).
# 2 menu mới (không xóa menu/mục cũ): "Velis – Về Velis (chân trang)" cho cột 3 footer, "Velis – Pháp lý (dòng cuối)" gán vị trí bottom.
import sys,json;sys.path.insert(0,'b12');from rest import s,S,get
def menu(name, items, loc=None):
    ex=[m for m in get('wp/v2/menus?context=edit') if m['name']==name]
    m=ex[0] if ex else s.post(S+'wp/v2/menus',json={'name':name}).json()
    have=[i['title']['raw'] for i in get(f"wp/v2/menu-items?menus={m['id']}&context=edit&per_page=100")]
    for n,(t,kind,obj,extra) in enumerate(items,1):
        if t in have: continue
        body={'title':t,'menus':m['id'],'menu_order':n,'status':'publish',**extra}
        body.update({'type':'post_type','object':'page','object_id':obj} if kind=='page' else {'type':'taxonomy','object':'category','object_id':obj} if kind=='cat' else {'type':'custom','url':obj})
        r=s.post(S+'wp/v2/menu-items',json=body); print(name,t,r.status_code)
    if loc: r=s.post(S+f"wp/v2/menus/{m['id']}",json={'locations':[loc]}); print('loc',loc,r.status_code)
    return m['id']
a=menu('Velis – Về Velis (chân trang)',[('Giới thiệu','page',19551,{}),('Chủ đầu tư','page',20955,{}),('Blog','cat',40,{}),('Tuyển dụng','page',19542,{}),('Liên hệ','page',19544,{}),('Thi thử CCMG','custom','/thi/',{'target':'_blank'})])
b=menu('Velis – Pháp lý (dòng cuối)',[('Chính sách bảo mật','page',19662,{}),('Điều khoản sử dụng','page',19659,{})],'bottom')
print(a,b, get('wp/v2/menu-locations')['bottom'])
