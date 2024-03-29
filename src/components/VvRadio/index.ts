import type { ExtractPropTypes } from 'vue'
import type { InputGroupState } from '../../types/group'
import { CheckboxRadioProps } from '../../props'
import { INJECTION_KEY_RADIO_GROUP } from '../../constants'

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
		useInjectedGroupState<InputGroupState>(INJECTION_KEY_RADIO_GROUP)

	// global props
	const modelValue = getGroupOrLocalRef('modelValue', props, emit)
	const valid = getGroupOrLocalRef('valid', props)
	const invalid = getGroupOrLocalRef('invalid', props)
	const readonly = computed(() =>
		Boolean(props.readonly || group?.readonly.value),
	)
	const disabled = computed(() =>
		Boolean(props.disabled || group?.disabled.value),
	)

	return {
		// local props
		id,
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
