import { type PropType, type ExtractPropTypes, toRefs, type Ref } from 'vue'
import { DisabledProps, ModifiersProps } from '@/props'
import type IButtonGroupState from '@/composables/group/types/IButtonGroupState'
import { useInjectedGroupState } from '@/composables/group/useInjectedGroupState'
import { VV_BUTTON_GROUP } from '@/constants'

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

export type VvButtonPropsTypes = ExtractPropTypes<typeof VvButtonProps>

/**
 * Merges local and group props
 */
export function useGroupProps(props: VvButtonPropsTypes) {
	const { group, isInGroup, getGroupOrLocalRef } =
		useInjectedGroupState<IButtonGroupState>(VV_BUTTON_GROUP)

	// local props
	const { iconPosition, icon, label, selected } = toRefs(props)

	// group props
	const modelValue = getGroupOrLocalRef('modelValue', props)
	const disabled = getGroupOrLocalRef('disabled', props) as Ref<boolean>
	const toggle = getGroupOrLocalRef('toggle', props) as Ref<boolean>
	const modifiers = getGroupOrLocalRef('modifiers', props) as Ref<
		string[] | string
	>

	return {
		// group props
		modelValue,
		disabled,
		toggle,
		isInGroup,
		group,
		modifiers,
		// local props
		selected,
		iconPosition,
		icon,
		label
	}
}
