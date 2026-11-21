// Screenshots of the built site beside the design's screens (lamp-web's screenshot script, adapted
// to JCT's reference PNGs).
//
//   npm run dev:preview                 (in another terminal; serves http://localhost:35173)
//   npm run screenshots -- [--base http://localhost:35173] [--set shell|pages|form]
//                          [--only header,home]
//                          [--tag before|after]
//
// For every view, width (390 / 1440) and theme, it takes the design's reference image and the
// built page, and saves one image with the reference on the left and the build on the right:
//   docs/screenshots/<set>/<view>-<width>-<theme>[-<tag>].jpg
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
const TAG = typeof args.tag === 'string' ? `-${args.tag}` : '';
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
	],
	// Session 3a: the six pages plus Privacy and Terms, full length, each beside its design screen.
	pages: [
		'home',
		'how-i-work',
		'services',
		'work',
		'about',
		'free-consult',
		'privacy',
		'terms'
	].map((view) => ({
		view,
		ref: screen(view),
		crop: 'full',
		built: {
			path: view === 'home' ? '/' : `/${view}`,
			pick: 'full',
			// Free Consult: bring the booking block on screen and give Calendly time to draw.
			before:
				view === 'free-consult'
					? async (p) => {
							await p.locator('section[aria-label]').last().scrollIntoViewIfNeeded();
							await p
								.waitForSelector('iframe[src*="calendly.com"]', { timeout: 10000 })
								.catch(() => {});
							await p.waitForTimeout(4000);
							await p.evaluate(() => scrollTo(0, 0));
						}
					: undefined
		}
	})),
	// Session 3b: the intake form's five states on /free-consult, each beside its design screen.
	// Calendly is blocked so the form shows (after the 8s wait). Needs the dev server
	// (`npm run dev:preview`, which always uses the emulators) and `npm run emulators`.
	form: ['form', 'form-errors', 'sending', 'send-error', 'success'].map((state) => ({
		view: state,
		ref: screen(`free-consult-${state}`),
		crop: 'full',
		built: {
			path: '/free-consult',
			pick: 'full',
			setup: async (ctx) => {
				await ctx.route(/assets\.calendly\.com/, (r) => r.abort());
				// Firestore emulator traffic: held (sending) or cut (send error).
				if (state === 'sending') await ctx.route(/:38180\//, () => {});
				if (state === 'send-error') await ctx.route(/:38180\//, (r) => r.abort());
			},
			before: (p) => intakeState(p, state)
		}
	}))
};

// The screens' sample input (copy-map › "Sample input in state screens": demo values only).
const SAMPLE = {
	name: 'Dana Reyes',
	email: 'dana@example.com',
	company: 'Example Co.',
	blocker: 'Our quotes from two factories are three times apart.'
};
async function intakeState(p, state) {
	await p.waitForSelector('form[novalidate]', { state: 'visible', timeout: 15000 });
	if (state === 'form') return;
	await p.waitForTimeout(3500); // past the form's bot check (3s on the page)
	await p.fill('#name', SAMPLE.name);
	await p.fill('#email', state === 'form-errors' ? 'dana@' : SAMPLE.email);
	await p.fill('#company', SAMPLE.company);
	if (state !== 'form-errors') await p.locator('label', { hasText: 'Prototype' }).click();
	await p.fill('#blocker', SAMPLE.blocker);
	await p.click('button[type="submit"]');
	if (state === 'sending') await p.waitForTimeout(500);
	if (state === 'send-error') await p.waitForSelector('[role="alert"]', { timeout: 20000 });
	if (state === 'success') await p.waitForSelector('[role="status"] h2', { timeout: 15000 });
	await p.evaluate(() => scrollTo(0, 0));
}

// --- capture -----------------------------------------------------------------------------------
async function shoot(browser, url, { pick, before, setup }, w, theme) {
	const ctx = await browser.newContext({
		colorScheme: theme,
		viewport: { width: w, height: w < 760 ? 844 : 1000 }
	});
	if (setup) await setup(ctx);
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
		// Let lazy images inside the now-visible page load.
		await page.waitForLoadState('networkidle');
		await page.evaluate(() =>
			Promise.race([
				Promise.all(
					[...document.images].map((i) =>
						i.complete ? null : new Promise((r) => i.addEventListener('load', r, { once: true }))
					)
				),
				new Promise((r) => setTimeout(r, 5000))
			])
		);
		await page.waitForTimeout(300);
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
			const name = `${item.view}-${w}-${theme}${TAG}`;
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
