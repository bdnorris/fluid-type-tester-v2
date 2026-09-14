export type FontChoice = { family: string }

/** Catalog used when the Google Fonts API key is missing or the request fails. */
export const FALLBACK_FONTS: FontChoice[] = [
	{ family: 'Roboto' },
	{ family: 'Open Sans' },
	{ family: 'Lato' },
	{ family: 'Montserrat' },
	{ family: 'Source Sans 3' },
	{ family: 'Nunito' },
	{ family: 'Poppins' },
	{ family: 'Work Sans' },
	{ family: 'Noto Sans' },
	{ family: 'PT Sans' },
	{ family: 'Oswald' },
	{ family: 'Raleway' },
	{ family: 'Merriweather' },
	{ family: 'Playfair Display' },
	{ family: 'Libre Baskerville' },
	{ family: 'Source Serif 4' },
	{ family: 'Noto Serif' },
	{ family: 'IBM Plex Sans' },
	{ family: 'IBM Plex Serif' },
	{ family: 'Fira Sans' },
	{ family: 'Inconsolata' },
	{ family: 'Source Code Pro' },
	{ family: 'Georgia' },
	{ family: 'Times New Roman' },
]

const SYSTEM_FONTS = new Set([
	'georgia',
	'times new roman',
	'times',
	'arial',
	'helvetica',
	'helvetica neue',
	'palatino',
	'garamond',
	'baskerville',
	'courier new',
	'courier',
	'system-ui',
	'ui-serif',
	'ui-sans-serif',
	'ui-monospace',
	'serif',
	'sans-serif',
	'monospace',
	'cursive',
	'fantasy',
])

export function isSystemFont(family: string): boolean {
	return SYSTEM_FONTS.has(family.trim().toLowerCase())
}

export function quoteCssFamily(family: string): string {
	const trimmed = family.trim()
	if (!trimmed) return 'sans-serif'
	if (/^[a-zA-Z][\w-]*$/.test(trimmed)) return trimmed
	return `"${trimmed.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

export function googleCssUrl(family: string): string {
	const encoded = family.trim().replace(/\s+/g, '+')
	return `https://fonts.googleapis.com/css2?family=${encoded}:ital,wght@0,400;0,700;1,400;1,700&display=swap`
}

export function fontStylesheetUrl(family: string): string {
	if (!family.trim() || isSystemFont(family)) return ''
	return googleCssUrl(family)
}

export function ensureFamily(list: FontChoice[], family: string): FontChoice[] {
	const name = family.trim()
	if (!name) return list
	if (list.some((font) => font.family === name)) return list
	return [{ family: name }, ...list]
}

export function sanitizeFamilyName(value: string): string {
	return value.replace(/[\n\r<>]/g, '').slice(0, 80)
}
