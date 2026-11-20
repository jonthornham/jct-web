import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

// lamp-web's Tailwind config with JCT's tokens (design/jct-download-01/tokens/). Every colour
// resolves to a CSS variable in src/app.css, light and dark; the theme switches on
// <html data-theme="light|dark">. Lamp-only colours (plot, trace, shot, fund, phase, rank, medal)
// are left out.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts,md,svx}'],
	darkMode: ['selector', '[data-theme="dark"]'],
	theme: {
		// JCT breakpoints (tokens.css --bp-*), min-width. They replace Tailwind's defaults.
		//   sm 760: phone → tablet (header CTA full label)   nav 900: menu button → full nav
		//   lg 1000: 2-up layouts side by side   xl 1180: offers 4-up   2xl 1280: header tagline
		screens: {
			sm: '760px',
			nav: '900px',
			lg: '1000px',
			xl: '1180px',
			'2xl': '1280px'
		},
		extend: {
			// Geist and Geist Mono, loaded in src/app.html.
			fontFamily: {
				sans: ['Geist', ...defaultTheme.fontFamily.sans],
				mono: ['"Geist Mono"', ...defaultTheme.fontFamily.mono]
			},
			fontSize: {
				xs: ['0.6875rem', { lineHeight: '1rem' }],
				sm: ['0.8125rem', { lineHeight: '1.25rem' }],
				'mk-hero': [
					'clamp(2.75rem, 1.5rem + 4vw, 4.5rem)',
					{ lineHeight: '1', letterSpacing: '-0.05em', fontWeight: '600' }
				],
				'mk-display': [
					'clamp(2.5rem, 1.6rem + 3.2vw, 4rem)',
					{ lineHeight: '1.02', letterSpacing: '-0.04em', fontWeight: '600' }
				],
				'mk-h1': [
					'clamp(2.25rem, 1.6rem + 2.2vw, 3.25rem)',
					{ lineHeight: '1.06', letterSpacing: '-0.035em', fontWeight: '600' }
				],
				'mk-h2': [
					'clamp(1.875rem, 1.4rem + 1.6vw, 2.5rem)',
					{ lineHeight: '1.12', letterSpacing: '-0.03em', fontWeight: '600' }
				],
				'mk-h3': [
					'clamp(1.625rem, 1.2rem + 1vw, 2rem)',
					{ lineHeight: '1.18', letterSpacing: '-0.01em', fontWeight: '600' }
				],
				'mk-title': [
					'1.375rem',
					{ lineHeight: '1.3', letterSpacing: '-0.005em', fontWeight: '600' }
				],
				'mk-lead': ['1.1875rem', { lineHeight: '1.6' }],
				'mk-body': ['1.0625rem', { lineHeight: '1.65' }],
				'mk-ui': ['0.9375rem', { lineHeight: '1.5' }],
				'mk-eyebrow': [
					'0.8125rem',
					{ lineHeight: '1.2', letterSpacing: '0.14em', fontWeight: '500' }
				]
			},
			maxWidth: { 'mk-content': '75rem' },
			spacing: {
				'mk-gutter': 'clamp(1.25rem, 4vw, 2.5rem)',
				'mk-section': 'clamp(3.5rem, 7vw, 5.5rem)',
				header: '64px'
			},
			borderRadius: {
				pill: '999px',
				input: '8px',
				step: '8px',
				icon: '10px',
				md: '14px',
				card: '18px',
				media: '24px'
			},
			boxShadow: {
				raised: '0 16px 40px -18px rgb(11 18 32 / .35)',
				seg: '0 1px 2px rgb(11 18 32 / .18)'
			},
			colors: {
				canvas: token('canvas'),
				surface: { DEFAULT: token('surface'), 2: token('surface-2'), 3: token('surface-3') },
				fg: { DEFAULT: token('fg'), muted: token('fg-muted'), subtle: token('fg-subtle') },
				primary: {
					DEFAULT: token('primary'),
					hover: token('primary-hover'),
					fg: token('primary-fg'),
					soft: token('primary-soft')
				},
				link: token('link'),
				focus: token('focus'),
				accent: {
					DEFAULT: token('accent'),
					hover: token('accent-hover'),
					fg: token('accent-fg'),
					soft: token('accent-soft'),
					text: token('accent-text')
				},
				success: {
					DEFAULT: token('success'),
					solid: token('success-solid'),
					fg: token('success-fg'),
					soft: token('success-soft')
				},
				warning: {
					DEFAULT: token('warning'),
					solid: token('warning-solid'),
					fg: token('warning-fg'),
					soft: token('warning-soft')
				},
				danger: {
					DEFAULT: token('danger'),
					solid: token('danger-solid'),
					fg: token('danger-fg'),
					soft: token('danger-soft')
				},
				neutral: {
					DEFAULT: token('neutral'),
					solid: token('neutral-solid'),
					fg: token('neutral-fg'),
					soft: token('neutral-soft')
				}
			},
			borderColor: {
				DEFAULT: token('border'),
				subtle: token('border'),
				strong: token('border-strong')
			},
			divideColor: { DEFAULT: token('border'), subtle: token('border') },
			// Rules drawn as elements (stage rail, hero float-card divider).
			backgroundColor: {
				border: token('border'),
				'border-strong': token('border-strong')
			},
			ringColor: {
				border: token('border'),
				'border-strong': token('border-strong'),
				subtle: token('border'),
				strong: token('border-strong')
			}
		}
	},
	plugins: [forms]
};
