import { get, writable } from 'svelte/store';
import { browser } from '$app/environment';

// lamp-web's theme store with JCT's key. The theme is set on <html data-theme="light|dark">.
// src/app.html sets it before first paint from the same localStorage key: keep the two in sync.
export const THEME_KEY = 'jct-theme';

const stored = () => {
	try {
		const t = localStorage.getItem(THEME_KEY);
		return t === 'light' || t === 'dark' ? t : null;
	} catch {
		return null;
	}
};

const systemQuery = browser ? window.matchMedia('(prefers-color-scheme: dark)') : null;
const system = () => (systemQuery?.matches ? 'dark' : 'light');

// The visitor's choice: 'system' (follow the device, the default), 'light' or 'dark'.
export const themeChoice = writable(browser ? (stored() ?? 'system') : 'system');

// The resolved theme: the saved choice, otherwise the system setting.
export const theme = writable(browser ? (stored() ?? system()) : 'light');

theme.subscribe((t) => {
	if (browser) document.documentElement.dataset.theme = t;
});

// Follow the system setting live until the visitor makes a choice.
systemQuery?.addEventListener('change', () => {
	if (!stored()) theme.set(system());
});

// Light or dark is saved in this browser as 'jct-theme'; 'system' clears it.
export const setThemeChoice = (choice) => {
	const next = choice === 'light' || choice === 'dark' ? choice : 'system';
	try {
		if (next === 'system') localStorage.removeItem(THEME_KEY);
		else localStorage.setItem(THEME_KEY, next);
	} catch {
		// Storage unavailable (private mode): the choice lasts for this page load only.
	}
	themeChoice.set(next);
	theme.set(next === 'system' ? system() : next);
};

export const toggleTheme = () => setThemeChoice(get(theme) === 'dark' ? 'light' : 'dark');
