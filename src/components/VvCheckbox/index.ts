import type { ExtractPropTypes, Ref } from 'vue'
import type { InputGroupState } from '../../types/group'
import { CheckboxRadioProps, ModifiersProps } from '../../props'
import { INJECTION_KEY_CHECK_GROUP } from '../../constants'

export const VvCheckboxProps = {
	...CheckboxRadioProps,
	...ModifiersProps,
	/**
	 * If true, the input will be indeterminated
	 */
	indeterminate: Boolean,
	/**
	 * Value associated with the unchecked state
	 */
	uncheckedValue: [String, Number, Boolean],
	/**
	 * If true, the input will be displayed as a switch
	 */
	switch: Boolean,
}

export const VvCheckboxEvents = ['click', 'update:modelValue', 'change', 'blur']

export type VvCheckboxPropsTypes = ExtractPropTypes<typeof VvCheckboxProps>

/**
 * Merges local and group props
 */
export function useGroupProps(
	props: VvCheckboxPropsTypes,
	emit: (event: (typeof VvCheckboxEvents)[number], value: unknown) => void,
) {
	const { group, isInGroup, getGroupOrLocalRef } =
		useInjectedGroupState<InputGroupState>(INJECTION_KEY_CHECK_GROUP)

	// local props
	const { id, switch: propsSwitch, indeterminate } = toRefs(props)

	// global props
	const modelValue = getGroupOrLocalRef('modelValue', props, emit)
	const valid = getGroupOrLocalRef('valid', props) as Ref<boolean>
	const invalid = getGroupOrLocalRef('invalid', props) as Ref<boolean>
	const readonly = computed(() =>
		Boolean(props.readonly || group?.value?.readonly.value),
	)
	const disabled = computed(() =>
		Boolean(props.disabled || group?.value?.disabled.value),
	)

	return {
		// local props
		id,
		propsSwitch,
		indeterminate,
		// global props
		group,
		isInGroup,
		modelValue,
		valid,
		invalid,
		readonly,
		disabled,
	}
}
