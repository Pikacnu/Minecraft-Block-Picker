const blocks = window.block_data.map((block) => ({
	...block,
	r: block.rgb[0],
	g: block.rgb[1],
	b: block.rgb[2],
}));

const result = document.createElement('div');
result.id = 'result';
document.body.appendChild(result);

let prev = {
	r: 255,
	g: 255,
	b: 255,
};

function hextoRGB(hex) {
	return {
		r: parseInt(hex.substring(1, 3), 16),
		g: parseInt(hex.substring(3, 5), 16),
		b: parseInt(hex.substring(5, 7), 16),
	};
}

document.addEventListener('mousemove', async (e) => {
	const { clientX, clientY } = e;
	const result = document.getElementById('result');
	result.style.top = `${clientY + 10}px`;
	result.style.left = `${clientX + 10}px`;
});

document.addEventListener('dblclick', () => {
	handleDoubleClick();
});

function handleDoubleClick() {
	let eyedropper = new EyeDropper();
	eyedropper.open().then((color) => {
		let hex = color.sRGBHex;
		let rgb = hextoRGB(hex);
		try {
			if (rgb.r === NaN || rgb.g === NaN || rgb.b === NaN) return;
			if (prev && prev.r === rgb.r && prev.g === rgb.g && prev.b === rgb.b)
				return;
			prev = rgb;
			result.innerHTML = '';
			const distance = blocks.map((block) => {
				const distance = Math.sqrt(
					Math.pow(block.r - rgb.r, 2) +
						Math.pow(block.g - rgb.g, 2) +
						Math.pow(block.b - rgb.b, 2),
				);
				return { ...block, distance };
			});
			distance.sort((a, b) => a.distance - b.distance);
			distance.slice(0, 5).forEach(async (block) => {
				const img = document.createElement('img');
				img.classList = 'block';
				img.src = chrome.runtime.getURL(`/assest/blocks/${block.id}`);
				img.alt = block.id.replace('.png', '');
				result.appendChild(img);
			});
		} catch (e) {}
	});
}

document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape') {
		result.innerHTML = '';
	}
});
