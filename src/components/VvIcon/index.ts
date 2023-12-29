import type { IconifyIconOnLoad, IconifyRenderMode } from '@iconify/vue'

export const ACTION_ICONS = {
	showPassword: 'eye-on',
	hidePassword: 'eye-off',
	showDatePicker: 'calendar',
	showTimePicker: 'time',
	showColorPicker: 'color',
	clear: 'close',
	add: 'add',
	remove: 'trash',
	edit: 'edit',
	download: 'download',
} as const

export enum IconPrefix {
	simple = 'simple',
	normal = 'normal',
	detailed = 'detailed',
}

export type VvIconProps = {
	/**
	 * Icon name
	 * Can be the full composition of iconify name "@{provider}:{prefix}:{name}" or "{prefix}:{name}" or "{name}"
	 * https://docs.iconify.design/api/providers.html#provider-in-icon-name
	 */
	name: string
	color?: string
	width?: string | number
	height?: string | number
	/**
	 * If custom collection is not added with "addCollection" DS class method, this prop could not be used
	 * Icon provider: https://docs.iconify.design/api/providers.html#provider-in-icon-name
	 */
	provider?: string
	/**
	 * @default 'normal'
	 * The name of icon set.
	 * Icon default options prefix: simple | normal | detailed
	 */
	prefix?: IconPrefix | string
	/**
	 * Url remote SVG icon
	 */
	src?: string
	horizontalFlip?: boolean
	verticalFlip?: boolean
	/**
	 * String alternative to "horizontalFlip" and "verticalFlip".
	 * Example: https://docs.iconify.design/icon-components/vue/transform.html
	 */
	flip?: string
	/**
	 * Icon render mode
	 * 'style' = 'bg' or 'mask', depending on icon content
	 * 'bg' = span with style using `background`
	 * 'mask' = span with style using `mask`
	 * 'svg' = svg
	 * Iconify doc: https://docs.iconify.design/iconify-icon/modes.html
	 */
	mode?: IconifyRenderMode
	/**
	 * Toggles inline or block mode
	 * Example https://docs.iconify.design/icon-components/vue/inline.html
	 */
	inline?: boolean
	/**
	 * rotates icon
	 * Example https://docs.iconify.design/icon-components/vue/transform.html
	 */
	rotate?: number | string
	/**
	 * A callback that is called when icon data has been loaded
	 */
	onLoad?: IconifyIconOnLoad
	/**
	 * SVG icon string
	 */
	svg?: string
	/**
	 * Icon modifiers: vv-icon css helper classes, value/s are concatened with prefix 'vv-icon--'
	 * @values string | string[]
	 */
	modifiers?: string | string[]
}

export const VvIconPropsDefaults = {
	prefix: IconPrefix.normal,
}
