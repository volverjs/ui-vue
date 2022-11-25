import { DisabledProps, ModifiersProps } from '@/props'
import type { PropType, ExtractPropTypes } from 'vue'

export enum ButtonIconPosition {
	left = 'left',
	right = 'right',
	top = 'top',
	bottom = 'bottom'
}

export enum ButtonType {
	button = 'button',
	submit = 'submit',
	reset = 'reset'
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
	...ModifiersProps,
	...DisabledProps,
	/**
	 * Button icon
	 */
	icon: {
		type: [String, Object],
		default: ''
	},
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
	label: [String, Number],
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
	active: Boolean,
	/**
	 * Button selected mode
	 */
	selected: Boolean,
	/**
	 * Link rel
	 */
	rel: {
		type: String,
		default: 'noopener noreferrer'
	},
	/**
	 * Button type
	 */
	type: {
		type: String,
		default: ButtonType.button,
		validator: (value: string) => value in ButtonType
	}
}

type _VvButtonPropsType = typeof VvButtonProps
export type VvButtonPropsTypes = ExtractPropTypes<_VvButtonPropsType>
