import type { PropType, ExtractPropTypes } from 'vue'
import type { ButtonGroupState } from '../../types/group'
import {
	ActionProps,
	IdProps,
	LoadingProps,
	ModifiersProps,
	UnselectableProps,
	IconProps,
} from '../../props'
import { INJECTION_KEY_BUTTON_GROUP, Side } from '../../constants'

export const VvButtonEvents = ['update:modelValue']

export const VvButtonProps = {
	...ActionProps,
	...IdProps,
	...ModifiersProps,
	...UnselectableProps,
	...LoadingProps,
	...IconProps,
	/**
	 * Button icon position
	 */
	iconPosition: {
		type: String as PropType<`${Side}`>,
		default: Side.left,
		validator: (value: Side) => Object.values(Side).includes(value),
	},
	/**
	 * Loading icon
	 */
	loadingIcon: { type: String, default: 'eos-icons:bubble-loading' },
	/**
	 * Enable button toggle
	 */
	toggle: {
		type: Boolean,
		default: false,
	},
	/**
	 * Button toggle value
	 */
	value: {
		type: [String, Number, Boolean],
		default: undefined,
	},
	/**
	 * Value associated with the unchecked state
	 */
	uncheckedValue: {
		type: [String, Number, Boolean],
		default: undefined,
	},
	/**
	 * Button toggle model value
	 */
	modelValue: {
		type: [String, Number, Boolean],
		default: undefined,
	},
}

export type VvButtonPropsTypes = ExtractPropTypes<typeof VvButtonProps>

/**
 * Merges local and group props
 */
export function useGroupProps(
	props: VvButtonPropsTypes,
	emit: (event: (typeof VvButtonEvents)[number], value: unknown) => void,
) {
	const { group, isInGroup, getGroupOrLocalRef } =
		useInjectedGroupState<ButtonGroupState>(INJECTION_KEY_BUTTON_GROUP)

	// local props
	const { id, iconPosition, icon, label, pressed } = toRefs(props)

	// group props
	const modelValue = getGroupOrLocalRef('modelValue', props, emit)
	const toggle = getGroupOrLocalRef('toggle', props)
	const unselectable = getGroupOrLocalRef('unselectable', props)
	const multiple = computed(() => group?.multiple.value ?? false)
	// merge local and group modifiers
	const modifiers = computed(() => {
		let localModifiers = props.modifiers
		let groupModifiers = group?.modifiers.value

		const toReturn = new Set<string>()
		if (localModifiers) {
			if (!Array.isArray(localModifiers)) {
				localModifiers = localModifiers.split(' ')
			}
			localModifiers.forEach((modifier) => toReturn.add(modifier))
		}
		if (groupModifiers) {
			if (!Array.isArray(groupModifiers)) {
				groupModifiers = groupModifiers.split(' ')
			}
			groupModifiers.forEach((modifier) => toReturn.add(modifier))
		}
		return Array.from(toReturn)
	})
	const disabled = computed(() =>
		Boolean(props.disabled || group?.disabled.value),
	)

	return {
		// group props
		group,
		isInGroup,
		modelValue,
		toggle,
		unselectable,
		multiple,
		modifiers,
		disabled,
		// local props
		id,
		pressed,
		iconPosition,
		icon,
		label,
	}
}
