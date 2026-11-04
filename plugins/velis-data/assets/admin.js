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
		list.addEventListener('input', (e) => { // keep the card title in sync with "Tên dòng"
			if (e.target.name?.endsWith('[name]')) e.target.closest('.velis-line').querySelector('.velis-line__title').textContent = e.target.value || 'Dòng mới';
		});
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
