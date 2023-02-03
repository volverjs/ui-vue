import type { Ref, PropType, ExtractPropTypes } from 'vue'
import type { ButtonGroupState } from '@/types/group'
import {
	ActionProps,
	IdProps,
	LoadingProps,
	ModifiersProps,
	UnselectableProps,
} from '@/props'
import { INJECTION_KEY_BUTTON_GROUP, Side } from '@/constants'

export const VvButtonEvents = ['update:modelValue']

export const VvButtonProps = {
	...ActionProps,
	...IdProps,
	...ModifiersProps,
	...UnselectableProps,
	...LoadingProps,
	/**
	 * Button icon
	 */
	icon: [String, Object],
	/**
	 * Button icon position
	 */
	iconPosition: {
		type: String as PropType<Side>,
		default: Side.left,
		validator: (value: Side) => Object.values(Side).includes(value),
	},
	/**
	 * Loading icon
	 */
	loadingIcon: { type: String, default: 'eos-icons:bubble-loading' },
	toggle: {
		type: Boolean,
		default: false,
	},
	modelValue: String,
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
	const {
		id,
		iconPosition,
		icon,
		label,
		pressed,
		modifiers: localModifiers,
	} = toRefs(props)

	// group props
	const modelValue = getGroupOrLocalRef('modelValue', props, emit) as Ref<
		string | Array<string> | undefined
	>
	const disabled = getGroupOrLocalRef('disabled', props) as Ref<boolean>
	const toggle = getGroupOrLocalRef('toggle', props) as Ref<boolean>
	const unselectable = getGroupOrLocalRef(
		'unselectable',
		props,
	) as Ref<boolean>
	const multiple = group?.value?.multiple ?? ref(false)

	const modifiers = computed(() => {
		const localValue = localModifiers?.value
			? Array.isArray(localModifiers.value)
				? localModifiers.value
				: localModifiers.value.split(' ')
			: []
		const groupValue = group?.value.itemModifiers?.value
			? Array.isArray(group.value.itemModifiers.value)
				? group.value.itemModifiers.value
				: group.value.itemModifiers.value.split(' ')
			: []
		return [...localValue, ...groupValue]
	})

	return {
		// group props
		group,
		isInGroup,
		modelValue,
		disabled,
		toggle,
		unselectable,
		multiple,
		// local props
		id,
		modifiers,
		pressed,
		iconPosition,
		icon,
		label,
	}
}
