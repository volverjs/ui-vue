import { type ExtractPropTypes, type Ref, toRefs } from 'vue'
import type { IInputGroupState } from '@/composables/group/types/IInputGroup'
import { useInjectedGroupState } from '@/composables/group/useInjectedGroupState'
import { CheckboxRadioProps } from '@/props'
import { VV_CHECK_GROUP } from '@/constants'

export const VvCheckboxProps = {
	...CheckboxRadioProps,
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
	switch: Boolean
}

export const VvCheckboxEvents = ['click', 'update:modelValue', 'change', 'blur']

export type VvCheckboxPropsTypes = ExtractPropTypes<typeof VvCheckboxProps>

/**
 * Merges local and group props
 */
export function useGroupProps(
	props: VvCheckboxPropsTypes,
	emit: (event: (typeof VvCheckboxEvents)[number], value: unknown) => void
) {
	const { group, isInGroup, getGroupOrLocalRef } =
		useInjectedGroupState<IInputGroupState>(VV_CHECK_GROUP)

	// local props
	const { switch: propsSwitch, indeterminate } = toRefs(props)

	// global props
	const modelValue = getGroupOrLocalRef('modelValue', props, emit)
	const readonly = getGroupOrLocalRef('readonly', props) as Ref<boolean>
	const disabled = getGroupOrLocalRef('disabled', props) as Ref<boolean>
	const valid = getGroupOrLocalRef('valid', props) as Ref<boolean>
	const invalid = getGroupOrLocalRef('invalid', props) as Ref<boolean>

	return {
		// local props
		propsSwitch,
		indeterminate,
		// global props
		group,
		isInGroup,
		modelValue,
		readonly,
		disabled,
		valid,
		invalid
	}
}
