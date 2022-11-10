import type { PropType, ExtractPropTypes } from 'vue'

export enum ButtonIconPosition {
	left = 'left',
	right = 'right',
	top = 'top',
	bottom = 'bottom'
}

export enum ButtonTag {
	nuxtLink = 'nuxt-link',
	routerLink = 'router-link',
	a = 'a',
	button = 'button'
}

export enum ButtonTarget {
	_blank = '_blank',
	_self = '_self',
	_parent = '_parent',
	_top = '_top'
}

export const VvButtonEvents = ['update:modelValue']

export const VvButtonProps = {
	/**
	 * Button icon
	 */
	icon: String,
	/**
	 * Button icon position
	 */
	iconPosition: {
		type: String as PropType<ButtonIconPosition>,
		default: ButtonIconPosition.left,
		validator: (value: string) => value in ButtonIconPosition
	},
	/**
	 * Button label
	 */
	label: String,
	/**
	 * Loading status
	 */
	loading: Boolean,
	/**
	 * Loading icon
	 */
	loadingIcon: { type: String, default: 'eos-icons:bubble-loading' },
	/**
	 * Loading label
	 */
	loadingLabel: {
		type: String,
		default: 'Loading...'
	},
	/**
	 * The router-link/nuxt-link property, if it is defined the button is rendered as a ruouter-link or nuxt-link.
	 * @see Documentation of [router-link](https://router.vuejs.org/api/#router-link) and [nuxt-link](https://nuxtjs.org/api/components-nuxt-link/)
	 */
	to: {
		type: [String, Object]
	},
	/**
	 * Link href
	 */
	href: String,
	/**
	 * Link target
	 */
	target: {
		type: String as PropType<ButtonTarget>,
		validator: (value: string) => value in ButtonTarget
	},
	/**
	 * Create block level button that span the full width of a parent.
	 */
	block: Boolean,
	/**
	 * Button active state.
	 */
	active: Boolean,
	/**
	 * Button rounded.
	 */
	rounded: Boolean,
	/**
	 * Button disabled
	 */
	disabled: Boolean,
	/**
	 * Button with min-width
	 */
	fullBleed: Boolean,
	/**
	 * Button action mode
	 */
	action: Boolean,
	/**
	 * Button action mode
	 */
	actionQuiet: Boolean,
	/**
	 * Button selected mode
	 */
	selected: Boolean,
	/**
	 * The variant of the button
	 * @values
	 * @defaultvalue default
	 */
	modifiers: [Array, String]
}

type _VvButtonPropsType = typeof VvButtonProps
export type VvButtonPropsTypes = ExtractPropTypes<_VvButtonPropsType>
