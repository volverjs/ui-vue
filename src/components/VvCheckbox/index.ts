import { type ExtractPropTypes, type Ref, toRefs } from 'vue'
import type { IInputGroupState } from '@/composables/group/types/IInputGroup'
import { useInjectedGroupState } from '@/composables/group/useInjectedGroupState'
import { ValidProps, ErrorProps, HintProps } from '@/props'
import { VV_CHECK_GROUP } from '@/constants'

export const VvCheckboxProps = {
	...ValidProps,
	...ErrorProps,
	...HintProps,
	/**
	 * Input id
	 */
	id: [String, Number],
	/**
	 * Input name
	 */
	name: { type: String, required: true },
	/**
	 * Input value
	 */
	value: [String, Number, Boolean],
	/**
	 * Input value
	 * @description
	 * If binary the input value can be an Object, a Boolean or a Number
	 * If not binary the input value must be an Array
	 */
	modelValue: [Object, Number, Boolean, String],
	/**
	 * Input name
	 */
	label: String,
	/**
	 * If true, the input will be disabled
	 */
	disabled: Boolean,
	/**
	 * If true, the input will be readonly
	 */
	readonly: Boolean,
	/**
	 * Value associated with the checked state (returned instead of TRUE)
	 */
	trueValue: { type: [String, Number, Boolean], default: undefined },
	/**
	 * Value associated with the unchecked state (returned instead of FALSE)
	 */
	falseValue: { type: [String, Number, Boolean], default: undefined },
	/**
	 * If true, the input will be displayed as a switch
	 */
	switch: Boolean,
	/**
	 * Sequential keyboard navigation
	 */
	tabindex: { type: [String, Number], default: 0 }
}

export const VvCheckboxEvents = ['click', 'update:modelValue', 'change', 'blur']

export type VvCheckboxPropsTypes = ExtractPropTypes<typeof VvCheckboxProps>

/**
 * Merges local and group props
 */
export function useGroupProps(
	props: VvCheckboxPropsTypes,
	emit: (event: typeof VvCheckboxEvents[number], value: unknown) => void
) {
	const { group, isInGroup, getGroupOrLocalRef } =
		useInjectedGroupState<IInputGroupState>(VV_CHECK_GROUP)

	// local props
	const { valid, error, switch: propsSwitch } = toRefs(props)

	// global props
	const modelValue = getGroupOrLocalRef('modelValue', props, emit)
	const readonly = getGroupOrLocalRef('readonly', props) as Ref<boolean>
	const disabled = getGroupOrLocalRef('disabled', props) as Ref<boolean>

	return {
		// local props
		valid,
		error,
		propsSwitch,
		// global props
		group,
		isInGroup,
		modelValue,
		readonly,
		disabled
	}
}
