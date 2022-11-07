import type { VvCheckPropsTypes } from './VvCheck'
import type { IInputGroupState } from '@/composables/group2/types/IInputGroup'

import { toRefs } from 'vue'

//Composables
import { useInjectedGroupState } from '../../composables/group2/useInjectedGroupState'

//Constasts
import { VV_CHECK_GROUP } from '../../constants'

/**
 * Estreae tutte le prop del componente VvButton che possono essere
 * "sovrascritte" quando il buttone si trova in un gruppo.
 */
export function toCheckInputRefs(
	props: VvCheckPropsTypes,
	emit: (event: any, ...args: any[]) => void
) {
	const { group, isInGroup, getGroupOrLocalRef } =
		useInjectedGroupState<IInputGroupState>(VV_CHECK_GROUP)

	//Local props
	const { valid, error, switch: propsSwitch } = toRefs(props)

	//Global props
	const modelValue = getGroupOrLocalRef('modelValue', props, emit)
	const readonly = getGroupOrLocalRef('readonly', props)
	const disabled = getGroupOrLocalRef('disabled', props)

	return {
		group,
		isInGroup,
		valid,
		error,
		propsSwitch,
		modelValue,
		readonly,
		disabled
	}
}
