import type { IconifyIcon } from '@iconify/types'

export function getIconsCollection(): {
	prefix: string
	icons: Record<string, IconifyIcon>
} {
	return {
		prefix: 'md',
		icons: {
			home: {
				body: '<path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8h5Z"/>'
			},
			account: {
				body: '<path fill="currentColor" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4Z"/>'
			},
			'arrow-left': {
				body: '<path fill="currentColor" d="M20 11v2H8l5.5 5.5l-1.42 1.42L4.16 12l7.92-7.92L13.5 5.5L8 11h12Z"/>'
			}
		}
	}
}
