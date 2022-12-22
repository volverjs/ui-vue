import { type ExtractPropTypes, type Ref, toRefs } from 'vue'
import type { IInputGroupState } from '@/composables/group/types/IInputGroup'
import { ValidProps, ErrorProps } from '@/props'
import { useInjectedGroupState } from '@/composables/group/useInjectedGroupState'
import { VV_RADIO_GROUP } from '@/constants'

export const VvRadioProps = {
	...ValidProps,
	...ErrorProps,
	/**
	 * Input value
	 */
	value: null,
	modelValue: { type: [Object, Number, Boolean, String] },
	label: { type: String, default: '' },
	disabled: Boolean,
	readonly: Boolean
}

export const VvRadioEvents = [
	'click',
	'update:modelValue',
	'change',
	'focus',
	'blur'
]

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
