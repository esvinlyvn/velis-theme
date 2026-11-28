// Kiểm kê UI chỉ đọc (khách xem, mật khẩu xem đọc từ $SP/view-pass.txt, không in): computed style mỗi trang × 1366/390. Dùng: cd <thư mục ra> && mkdir -p shots && SP=<scratchpad> node tools/the7_ui_audit.mjs pages.json → audit.json
import { createRequire } from 'node:module'; import { writeFileSync, readFileSync } from 'node:fs';
const { chromium } = createRequire('/home/user/velis-theme/tools/')('playwright');
const B = 'https://staging.velisrealty.vn';
const PAGES = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const UA = { 1366: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  390: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36' };
const b = await chromium.launch(); const out = [];
for (const w of [1366, 390]) {
  const c = await b.newContext({ viewport: { width: w, height: w < 800 ? 844 : 900 }, userAgent: UA[w], isMobile: w < 800, hasTouch: w < 800 });
  const p = await c.newPage();
  await p.goto(B + '/', { timeout: 120000 });
  if (await p.$('input[type=password]')) {
    await p.fill('input[type=password]', readFileSync(process.env.SP + '/view-pass.txt', 'utf8').trim());
    await Promise.all([p.waitForNavigation({ timeout: 120000 }), p.click('input[type=submit], button[type=submit]')]);
    if (await p.$('input[type=password]')) { console.log('view login failed – stop'); process.exit(3); }
  }
  for (const [name, u] of PAGES) {
    const r = await p.goto(B + u, { timeout: 120000, waitUntil: 'load' });
    await p.mouse.move(50, 300); await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise(r => setTimeout(r, 100)); } scrollTo(0, 0); });
    await p.waitForTimeout(2500);
    await p.screenshot({ path: `shots/${name}-${w}.png`, fullPage: true }).catch(() => {});
    const d = await p.evaluate(() => {
      const hex = s => { const m = s.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/); if (!m) return null; const a = m[4] === undefined ? 1 : +m[4]; if (a === 0) return null;
        const h = '#' + [m[1], m[2], m[3]].map(x => (+x | 0).toString(16).padStart(2, '0')).join('').toUpperCase(); return a < 1 ? h + '@' + (+a).toFixed(2) : h; };
      const vis = e => { const r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return false; const s = getComputedStyle(e); return s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.05; };
      const src = e => { if (e.closest('#wpadminbar')) return 'adminbar'; if (e.closest('.masthead, .dt-mobile-header, .mobile-header-bar, .dt-mobile-menu-icon, #phantom')) return 'header';
        if (e.closest('#footer, #bottom-bar, .footer')) return 'footer'; if (e.closest('.page-title, .breadcrumbs')) return 'page-title';
        if (e.closest('[class*=buttonizer], .buttonizer')) return 'buttonizer'; if (e.closest('.wpcf7')) return 'cf7'; if (e.closest('#sidebar, .sidebar')) return 'sidebar';
        if (e.closest('[style]') && e.closest('.wpb_wrapper, .vc_row, .entry-content') && (e.getAttribute('style') || e.closest('[style]').getAttribute('style') || '').match(/color|background/)) return 'inline';
        if (e.closest('[class*=ult-], [class*=ubtn], [class*=uvc], .ult_tabs, .uavc-list')) return 'ultimate';
        if (e.closest('.vc_row, .wpb_wrapper, [class*=vc_]')) return 'wpbakery'; if (e.closest('.ez-toc-container, #ez-toc-container')) return 'easy-toc';
        if (e.closest('.post, .articles-list, .blog-shortcode, .dt-css-grid, .related-posts, .single-related-posts')) return 'the7-blog'; return 'other'; };
      const desc = e => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
      const colors = {}; const add = (k, col, e) => { if (!col) return; const key = k + '|' + col; const o = colors[key] ||= { prop: k, color: col, n: 0, src: {}, ex: [] }; o.n++; const s = src(e); o.src[s] = (o.src[s] || 0) + 1; if (o.ex.length < 3) o.ex.push(desc(e) + '@' + s); };
      const all = [...document.querySelectorAll('body *')].filter(e => !e.closest('#wpadminbar') && !['SCRIPT', 'STYLE', 'NOSCRIPT', 'BR', 'svg', 'path'].includes(e.tagName));
      for (const e of all) { if (!vis(e)) continue; const s = getComputedStyle(e);
        const hasText = [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
        if (hasText) add('text', hex(s.color), e);
        add('bg', hex(s.backgroundColor), e);
        for (const side of ['Top', 'Right', 'Bottom', 'Left']) if (parseFloat(s['border' + side + 'Width']) > 0 && s['border' + side + 'Style'] !== 'none') add('border', hex(s['border' + side + 'Color']), e);
        if (s.backgroundImage.includes('gradient')) add('gradient', s.backgroundImage.slice(0, 80), e);
      }
      const typo = sel => [...document.querySelectorAll(sel)].filter(e => vis(e) && !e.closest('#wpadminbar')).slice(0, 40).map(e => { const s = getComputedStyle(e);
        return { el: desc(e), src: src(e), ff: s.fontFamily.split(',')[0].replace(/"/g, ''), fs: s.fontSize, fw: s.fontWeight, lh: s.lineHeight, tt: s.textTransform, ls: s.letterSpacing, color: hex(s.color), txt: e.textContent.trim().slice(0, 40) }; });
      const box = sel => [...document.querySelectorAll(sel)].filter(e => vis(e) && !e.closest('#wpadminbar')).slice(0, 30).map(e => { const s = getComputedStyle(e); const r = e.getBoundingClientRect();
        return { el: desc(e), src: src(e), txt: e.textContent.trim().slice(0, 30), bg: hex(s.backgroundColor), color: hex(s.color), border: s.borderTopWidth + ' ' + hex(s.borderTopColor), radius: s.borderTopLeftRadius, shadow: s.boxShadow === 'none' ? '' : s.boxShadow.slice(0, 60), ff: s.fontFamily.split(',')[0].replace(/"/g, ''), fs: s.fontSize, fw: s.fontWeight, tt: s.textTransform, h: Math.round(r.height), w: Math.round(r.width), pad: s.padding }; });
      const rows = [...document.querySelectorAll('.wf-container-main .vc_row, .content .vc_row, #main .vc_row')].filter(e => vis(e) && !e.parentElement.closest('.vc_row')).slice(0, 40).map(e => { const s = getComputedStyle(e); const r = e.getBoundingClientRect(); return { el: desc(e), pt: s.paddingTop, pb: s.paddingBottom, mb: s.marginBottom, bg: hex(s.backgroundColor), w: Math.round(r.width), x: Math.round(r.left) }; });
      const content = (() => { const e = document.querySelector('#content, .content'); if (!e) return null; const r = e.getBoundingClientRect(); return { w: Math.round(r.width), x: Math.round(r.left) }; })();
      const inlineStyles = [...document.querySelectorAll('#content [style], .content [style], #main [style]')].map(e => e.getAttribute('style')).filter(s => /color|background|font-size|font-family/i.test(s));
      return { title: document.title, colors: Object.values(colors), content,
        typo: { h1: typo('h1'), h2: typo('h2'), h3: typo('h3'), h4: typo('h4'), p: typo('#content p, .content p').slice(0, 8), li: typo('#content li, .content li').slice(0, 5), a: typo('#content p a, .content p a').slice(0, 8) },
        buttons: box('a.dt-btn, .dt-btn, .vc_btn3, .vc_general.vc_btn3, .ubtn, a.ubtn-link .ubtn, button, input[type=submit], .wpcf7-submit, .header-elements-button-1, .btn-velis, a[class*=button]'),
        inputs: box('.wpcf7 input:not([type=submit]):not([type=hidden]), .wpcf7 textarea, .wpcf7 select, input[type=search]'),
        cards: box('article.post, .post.project-odd, .post.project-even, .dt-css-grid > div, .vc_gitem, .ult-content-box'),
        toggles: box('.vc_toggle_title, .vc_tta-panel-heading, .ult_exp_section'),
        tables: box('table, th, td').slice(0, 6),
        breadcrumbs: box('.breadcrumbs, .breadcrumbs li, .breadcrumbs a').slice(0, 4),
        pagination: box('.paginator, .paginator a, .page-numbers, .paginator .page-nav').slice(0, 6),
        footer: box('#footer, #bottom-bar, .footer .widget, #footer .widget-title, #footer a').slice(0, 10),
        pagetitle: box('.page-title, .page-title h1, .page-title .breadcrumbs').slice(0, 3),
        hr: box('hr, .vc_separator, .vc_sep_line, .dt-fancy-separator, .hr-thin, .ult-just-icon-wrapper, .uvc-heading-spacer, .uvc-headings-line').slice(0, 10),
        rows, inlineStyles: inlineStyles.slice(0, 200), nInline: inlineStyles.length,
        logos: [...document.querySelectorAll('img')].filter(i => /logo/i.test(i.currentSrc + i.className + i.alt)).map(i => ({ src: i.currentSrc.replace(location.origin, ''), w: i.width, h: i.height, vis: vis(i), alt: i.alt, where: src(i) })),
        icons: [...document.querySelectorAll('link[rel*=icon], meta[property="og:image"], meta[name="twitter:image"], meta[property="og:site_name"], meta[name="theme-color"], link[rel=apple-touch-icon]')].map(l => (l.rel || l.getAttribute('property') || l.name) + ' = ' + (l.href || l.content)),
        over: document.documentElement.scrollWidth > innerWidth, h1n: document.querySelectorAll('h1').length,
        fonts: [...new Set([...document.querySelectorAll('body *')].slice(0, 4000).map(e => getComputedStyle(e).fontFamily.split(',')[0].replace(/"/g, '').trim()))] };
    });
    d.status = r.status(); d.name = name; d.url = u; d.w = w; out.push(d);
    console.log(w, name, r.status(), 'colors', d.colors.length, 'inline', d.nInline, 'h1', d.h1n);
  }
  await c.close();
}
writeFileSync('audit.json', JSON.stringify(out));
await b.close();
