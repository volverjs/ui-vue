import type { ExtractPropTypes, Ref } from 'vue'
import type { IInputGroupState } from '@/composables/group/types/IInputGroup'
import { CheckboxRadioProps } from '@/props'
import { VV_RADIO_GROUP } from '@/constants'

export const VvRadioProps = CheckboxRadioProps

export const VvRadioEvents = ['click', 'update:modelValue', 'change', 'blur']

export type VvRadioPropsType = ExtractPropTypes<typeof VvRadioProps>

/**
 * Merges local and group props
 */
export function useGroupProps(
	props: VvRadioPropsType,
	emit: (event: (typeof VvRadioEvents)[number], value: unknown) => void,
) {
	const { id } = toRefs(props)
	const { group, isInGroup, getGroupOrLocalRef } =
		useInjectedGroupState<IInputGroupState>(VV_RADIO_GROUP)

	// global props
	const modelValue = getGroupOrLocalRef('modelValue', props, emit)
	const readonly = getGroupOrLocalRef('readonly', props) as Ref<boolean>
	const disabled = getGroupOrLocalRef('disabled', props) as Ref<boolean>
	const valid = getGroupOrLocalRef('valid', props) as Ref<boolean>
	const invalid = getGroupOrLocalRef('invalid', props) as Ref<boolean>

	return {
		// local props
		id,
		// global props
		group,
		isInGroup,
		modelValue,
		readonly,
		disabled,
		valid,
		invalid,
	}
}
