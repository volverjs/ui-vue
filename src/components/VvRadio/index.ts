import { type ExtractPropTypes, type Ref, toRefs } from 'vue'
import type { IInputGroupState } from '@/composables/group/types/IInputGroup'
import { ValidProps, ErrorProps, HintProps } from '@/props'
import { useInjectedGroupState } from '@/composables/group/useInjectedGroupState'
import { VV_RADIO_GROUP } from '@/constants'

export const VvRadioProps = {
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
	value: undefined,
	/**
	 * Input value
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
	 * Sequential keyboard navigation
	 */
	tabindex: { type: [String, Number], default: 0 }
}

export const VvRadioEvents = ['click', 'update:modelValue', 'change', 'blur']

export type VvRadioPropsType = ExtractPropTypes<typeof VvRadioProps>

/**
 * Merges local and group props
 */
export function useGroupProps(
	props: VvRadioPropsType,
	emit: (event: typeof VvRadioEvents[number], value: unknown) => void
) {
	const { group, isInGroup, getGroupOrLocalRef } =
		useInjectedGroupState<IInputGroupState>(VV_RADIO_GROUP)

	// local props
	const { valid, error } = toRefs(props)

	// global props
	const modelValue = getGroupOrLocalRef('modelValue', props, emit)
	const readonly = getGroupOrLocalRef('readonly', props) as Ref<boolean>
	const disabled = getGroupOrLocalRef('disabled', props) as Ref<boolean>

	return {
		// local props
		valid,
		error,
		// global props
		group,
		isInGroup,
		modelValue,
		readonly,
		disabled
	}
}
