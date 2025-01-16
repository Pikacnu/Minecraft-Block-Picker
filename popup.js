import { block_data } from './assest/blocks.js';

// 當 popup 載入時，從 chrome.storage 讀取 hex 和 picked 資料
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['hex'], (data) => {
        const { hex } = data;

        if (hex) {
            // 顯示 hex 資料
            document.getElementById('hexValue').textContent = `${hex}`;
            // 設置 input 的值為 hex
            document.getElementById('input').value = hex;
            changeResult(hex);
        }
    });
});

const result = document.getElementById('result');
const input = document.getElementById('input');
const hexValue = document.getElementById('hexValue');
const pickedList = document.getElementById('pickedList');

const blocks = block_data.map((block) => ({
	...block,
	r: block.rgb[0],
	g: block.rgb[1],
	b: block.rgb[2],
}));

function hexToRGB(hex) {
	if (!hex) return null;
	let color = hex.replace('#', '');
	if (color.length === 3) {
		color = color
			.split('')
			.map((c) => c + c)
			.join('');
	}
	const r = parseInt(color.substring(0, 2), 16);
	const g = parseInt(color.substring(2, 4), 16);
	const b = parseInt(color.substring(4, 6), 16);
	return { r, g, b };
}

function changeResult(value) {
	const rgb = hexToRGB(value);
	result.innerHTML = '';
	pickedList.innerHTML = ''; // 清空 pickedList

	if (rgb) {
		const distance = blocks.map((block) => {
			const distance = Math.sqrt(
				Math.pow(block.r - rgb.r, 2) +
				Math.pow(block.g - rgb.g, 2) +
				Math.pow(block.b - rgb.b, 2),
			);
			return { ...block, distance };
		});
		distance.sort((a, b) => a.distance - b.distance);
		distance.slice(0, 5).forEach((block) => {
			// 更新圖片和 alt 資訊
			const blockContainer = document.createElement('div');
			blockContainer.classList.add('block-container');

			const img = document.createElement('img');
			img.src = chrome.runtime.getURL(`/assest/blocks/${block.id}`);
			img.alt = block.id.replace('.png', '');

			const altText = document.createElement('span');
			altText.textContent = img.alt;

			blockContainer.appendChild(img);
			blockContainer.appendChild(altText);
			result.appendChild(blockContainer);
		});
	}
}

changeResult(input.value);

input.addEventListener('input', () => {
	const value = input.value;
	changeResult(value);
});
