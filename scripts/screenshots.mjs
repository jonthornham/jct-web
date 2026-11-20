// Screenshots of the built site beside the design's screens (lamp-web's screenshot script, adapted
// to JCT's reference PNGs).
//
//   npm run dev:preview                 (in another terminal; serves http://localhost:35173)
//   npm run screenshots -- [--base http://localhost:35173] [--set shell] [--only header,home]
//
// For every view, width (390 / 1440) and theme, it takes the design's reference image and the
// built page, and saves one image with the reference on the left and the build on the right:
//   docs/screenshots/<set>/<view>-<width>-<theme>.jpg
// The references are the full-page PNGs in the design bundle's screens/ folder, which is not in
// git: set JCT_SCREENS to its path if it isn't ~/Development/JCT/design/jct-download-01/screens.
// It uses the Chrome installed on this machine (playwright-core, no browser download); set
// CHROME_PATH to use another.
import { mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { chromium } from 'playwright-core';
import sharp from 'sharp';

const args = Object.fromEntries(
	process.argv.slice(2).reduce((acc, a, i, all) => {
		if (a.startsWith('--'))
			acc.push([a.slice(2), all[i + 1]?.startsWith('--') ? true : all[i + 1]]);
		return acc;
	}, [])
);
const BASE = args.base ?? 'http://localhost:35173';
const SET = args.set ?? 'shell';
const ONLY = args.only ? String(args.only).split(',') : null;
const SCREENS =
	process.env.JCT_SCREENS ?? join(homedir(), 'Development/JCT/design/jct-download-01/screens');
const COMPONENTS = resolve('design/jct-download-01/components');
const OUT = resolve(`docs/screenshots/${SET}`);
const WIDTHS = [390, 1440];
const THEMES = ['light', 'dark'];
const CHROME =
	process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// --- what to capture -------------------------------------------------------------------------
// ref:   (w, theme) => PNG path, or null      crop: how to cut the reference to match
// built: { path, pick, before? }              pick: 'header' | 'footer' | 'menu' | 'full' | 'top'
const screen = (name) => (w, t) => join(SCREENS, `${name}-${w}-${t}.png`);
const SETS = {
	shell: [
		{ view: 'header', ref: screen('home'), crop: 'header', built: { path: '/', pick: 'header' } },
		{
			view: 'menu-open',
			widths: [390],
			ref: (w, t) => join(COMPONENTS, `header-menu-open-${w}-${t}.png`),
			crop: 'none',
			built: {
				path: '/services',
				pick: 'menu',
				before: (p) => p.click('button[aria-label="Open menu"]')
			}
		},
		{ view: 'footer', ref: screen('home'), crop: 'footer', built: { path: '/', pick: 'footer' } },
		// The Home stub against the top of the design's Home (the stub has only the hero's H1).
		{ view: 'home', ref: screen('home'), crop: 'top', built: { path: '/', pick: 'full' } },
		{
			view: '404',
			ref: screen('404'),
			crop: 'full',
			built: { path: '/no-such-page', pick: 'full' }
		}
	]
};

// --- capture -----------------------------------------------------------------------------------
async function shoot(browser, url, { pick, before }, w, theme) {
	const ctx = await browser.newContext({
		colorScheme: theme,
		viewport: { width: w, height: w < 760 ? 844 : 1000 }
	});
	const page = await ctx.newPage();
	await page.goto(url, { waitUntil: 'networkidle' });
	await page.evaluate(() => document.fonts.ready);
	await page.waitForTimeout(400);
	if (before) {
		await before(page);
		await page.waitForTimeout(400);
	}
	let clip;
	if (pick === 'full') {
		const height = await page.evaluate(() => document.documentElement.scrollHeight);
		await page.setViewportSize({ width: w, height });
		await page.waitForTimeout(200);
		clip = { x: 0, y: 0, width: w, height };
	} else if (pick === 'menu') {
		clip = { x: 0, y: 0, width: w, height: 540 };
	} else {
		clip = await page.evaluate((sel) => {
			const r = document.querySelector(sel).getBoundingClientRect();
			return { x: 0, y: r.top + scrollY, width: r.width, height: r.height };
		}, pick);
	}
	const shot = await page.screenshot({ clip, fullPage: true });
	await ctx.close();
	return { shot, height: clip.height };
}

/** Cuts the reference PNG to the part that matches the built capture. */
async function refImage(file, crop, w, builtHeight) {
	if (!existsSync(file)) return null;
	const img = sharp(file);
	const { width, height } = await img.metadata();
	const scale = width / w;
	const h = (px) => Math.min(height, Math.round(px * scale));
	let region = { left: 0, top: 0, width, height };
	if (crop === 'header') region = { ...region, height: h(64) };
	if (crop === 'footer')
		region = { ...region, top: height - h(builtHeight), height: h(builtHeight) };
	if (crop === 'top') region = { ...region, height: h(Math.max(builtHeight, 900)) };
	return img.extract(region).resize({ width: w }).png().toBuffer();
}

// Reference left, build right, labelled; rendered with the same browser.
async function compose(browser, left, right, title) {
	const ctx = await browser.newContext({
		viewport: { width: 400, height: 300 },
		deviceScaleFactor: 1
	});
	const page = await ctx.newPage();
	const img = (buf) => `data:image/png;base64,${buf.toString('base64')}`;
	const fig = (buf, label) =>
		`<figure style="margin:0"><figcaption style="padding:0 0 8px">${title} · ${label}</figcaption><img src="${img(buf)}"></figure>`;
	await page.setContent(`<body style="margin:0;background:#8a8f96;font:600 14px system-ui;color:#fff">
		<div id="s" style="display:inline-flex;gap:16px;padding:12px;align-items:flex-start">
			${left ? fig(left, 'design') : ''}${fig(right, 'built')}
		</div></body>`);
	const out = await page.locator('#s').screenshot({ type: 'jpeg', quality: 72 });
	await ctx.close();
	return out;
}

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: CHROME });
let count = 0;
for (const item of SETS[SET]) {
	if (ONLY && !ONLY.includes(item.view)) continue;
	for (const w of item.widths ?? WIDTHS) {
		for (const theme of THEMES) {
			const { shot, height } = await shoot(browser, BASE + item.built.path, item.built, w, theme);
			const left = await refImage(item.ref(w, theme), item.crop, w, height);
			const name = `${item.view}-${w}-${theme}`;
			writeFileSync(
				join(OUT, `${name}.jpg`),
				await compose(browser, left, shot, `${item.view} · ${w} · ${theme}`)
			);
			count++;
			console.log('✓', name, left ? '' : '(no reference found)');
		}
	}
}
await browser.close();
console.log(`${count} images in ${OUT}`);
