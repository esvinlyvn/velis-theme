/* Velis Data – admin helpers: repeatable product lines + core media picker. No dependencies besides wp.media. */
(() => {
	const box = document.querySelector('[data-lines]');
	if (box) {
		const list = box.querySelector('.velis-lines__list');
		const tpl = box.querySelector('[data-line-template]');
		const renumber = () => [...list.children].forEach((card, i) => card.querySelectorAll('[name^="velis_lines["]')
			.forEach((el) => (el.name = el.name.replace(/^velis_lines\[[^\]]+\]/, `velis_lines[${i}]`))));
		box.querySelector('[data-line-add]').addEventListener('click', () => {
			list.append(tpl.content.cloneNode(true));
			renumber();
			list.lastElementChild.querySelector('input')?.focus();
		});
		list.addEventListener('click', (e) => {
			const card = e.target.closest('.velis-line');
			if (!card) return;
			if (e.target.matches('[data-line-remove]') && confirm('Xóa dòng sản phẩm này?')) card.remove();
			if (e.target.matches('[data-line-up]') && card.previousElementSibling) card.after(card.previousElementSibling);
			if (e.target.matches('[data-line-down]') && card.nextElementSibling) card.before(card.nextElementSibling);
			if (e.target.closest('[data-line-remove],[data-line-up],[data-line-down]')) { e.preventDefault(); renumber(); }
		});
		// Collapsed-row summary "tên · diện tích · giá" (mirrors velis_line_summary() in PHP).
		const num = (v) => (v === '' ? '' : (+v).toLocaleString('vi-VN', { maximumFractionDigits: 2 }));
		const range = (f, t, u) => { f = num(f); t = num(t); return f && t && f !== t ? `${f}–${t} ${u}` : f ? (t ? `${f} ${u}` : `từ ${f} ${u}`) : t ? `đến ${t} ${u}` : ''; };
		list.addEventListener('input', (e) => {
			const card = e.target.closest('.velis-line');
			if (!card) return;
			const v = (k) => card.querySelector(`[name$="[${k}]"]`)?.value ?? '';
			const unit = card.querySelector('[name$="[price_unit]"]');
			const price = range(v('price_from'), v('price_to'), unit?.value ? unit.selectedOptions[0].text : '').trim();
			card.querySelector('.velis-line__title').textContent = [v('name') || 'Dòng mới', range(v('net_from'), v('net_to'), 'm²') || range(v('gross_from'), v('gross_to'), 'm²'), price].filter(Boolean).join(' · ');
		});
	}

	// Level decides which boxes apply; hidden boxes are disabled so their inputs are not submitted.
	const level = document.querySelector('[data-level]');
	if (level) {
		const sync = () => {
			const low = level.value === 'thap-tang';
			[['velis-project', !low], ['velis-lines', !low], ['velis-lowrise', low]].forEach(([id, on]) => {
				const el = document.getElementById(id);
				if (!el) return;
				el.hidden = !on;
				el.querySelectorAll('input, select, textarea, button').forEach((i) => (i.disabled = !on));
			});
		};
		level.addEventListener('change', sync);
		sync();
	}

	document.addEventListener('click', (e) => {
		const wrap = e.target.closest('.velis-media');
		if (!wrap) return;
		const input = wrap.querySelector('input[type=hidden]');
		const thumbs = wrap.querySelector('.velis-media__thumbs');
		if (e.target.matches('.velis-media__clear')) { input.value = ''; thumbs.innerHTML = ''; return; }
		if (!e.target.matches('.velis-media__pick')) return;
		const multiple = wrap.dataset.multiple === '1';
		const frame = wp.media({ title: 'Chọn ảnh', multiple, library: { type: '' } });
		frame.on('select', () => {
			const picked = frame.state().get('selection').toJSON();
			input.value = picked.map((a) => a.id).join(',');
			thumbs.innerHTML = picked.map((a) => `<img src="${(a.sizes?.thumbnail || a).url}" alt="" width="64" height="64">`).join('');
		});
		frame.open();
	});
})();
