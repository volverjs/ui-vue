import { type ExtractPropTypes, type Ref, toRefs } from 'vue'
import type { IInputGroupState } from '@/composables/group/types/IInputGroup'
import { useInjectedGroupState } from '@/composables/group/useInjectedGroupState'
import { ValidProps, ErrorProps } from '@/props'
import { VV_CHECK_GROUP } from '@/constants'

export const VvCheckProps = {
	...ValidProps,
	...ErrorProps,
	/**
	 * Radio value
	 */
	value: null,
	/**
	 * Input value
	 * @description
	 * If binary the input value can be an Object, a Boolean or a Number
	 * If not binary the input value must be an Array
	 */
	modelValue: null,
	/**
	 * If true, the input will be displayed as a binary input
	 */
	binary: Boolean,
	/**
	 * Value associated with the checked state (returned instead of TRUE)
	 */
	trueValue: { type: [String, Number, Boolean], default: true },
	/**
	 * Value associated with the unchecked state (returned instead of FALSE)
	 */
	falseValue: { type: [String, Number, Boolean], default: false },
	/**
	 * If true, the input will be displayed as a switch
	 */
	switch: Boolean,
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
	readonly: Boolean
}

export const VvCheckEvents = [
	'click',
	'update:modelValue',
	'change',
	'focus',
	'blur'
]

export type VvCheckPropsTypes = ExtractPropTypes<typeof VvCheckProps>

/**
 * Merges local and group props
 */
export function useGroupProps(
	props: VvCheckPropsTypes,
	emit: (event: typeof VvCheckEvents[number], value: unknown) => void
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
