import type { PropType } from 'vue'
import type { IconifyRenderMode } from '@iconify/vue'

export enum IconPrefix {
	simple = 'simple',
	normal = 'normal',
	detailed = 'detailed',
}

export const VvIconProps = {
	/**
	 * Color
	 */
	color: String,
	/**
	 * Width
	 */
	width: {
		type: [String, Number],
	},
	/**
	 * Height
	 */
	height: {
		type: [String, Number],
	},
	/**
	 * Icon name
	 * Can be the full composition of iconify name "@{provider}:{prefix}:{name}" or "{prefix}:{name}" or "{name}"
	 * https://docs.iconify.design/api/providers.html#provider-in-icon-name
	 */
	name: {
		type: String,
		required: true,
	},
	/**
	 * By default 'vv'
	 * If custom collection is not added with "addCollection" DS class method, this prop could not be used
	 * Icon provider: https://docs.iconify.design/api/providers.html#provider-in-icon-name
	 */
	provider: {
		type: String,
	},
	/**
	 * The name of icon set.
	 * Icon default options prefix: simple | normal | detailed
	 */
	prefix: {
		type: String as PropType<`${IconPrefix}` | string>,
		default: 'normal',
	},
	/**
	 * Url remote SVG icon
	 */
	src: String,
	/**
	 * Horizontal flip
	 */
	horizontalFlip: Boolean,
	/**
	 * Vertical flip
	 */
	verticalFlip: Boolean,
	/**
	 * String alternative to "horizontalFlip" and "verticalFlip".
	 * Example: https://docs.iconify.design/icon-components/vue/transform.html
	 */
	flip: String,
	/**
	 * Icon render mode
	 * 'style' = 'bg' or 'mask', depending on icon content
	 * 'bg' = span with style using `background`
	 * 'mask' = span with style using `mask`
	 * 'svg' = svg
	 * Iconify doc: https://docs.iconify.design/iconify-icon/modes.html
	 */
	mode: String as PropType<IconifyRenderMode>,
	/**
	 * Toggles inline or block mode
	 * Example https://docs.iconify.design/icon-components/vue/inline.html
	 */
	inline: Boolean,
	/**
	 * rotates icon
	 * Example https://docs.iconify.design/icon-components/vue/transform.html
	 */
	rotate: [Number, String],
	/**
	 * A callback that is called when icon data has been loaded
	 */
	onLoad: Function,
	/**
	 * SVG icon string
	 */
	svg: String,
	/**
	 * Icon modifiers: vv-icon css helper classes, value/s are concatened with prefix 'vv-icon--'
	 * @values string | Array<string>
	 */
	modifiers: {
		type: [String, Array] as PropType<string | string[]>,
	},
}
