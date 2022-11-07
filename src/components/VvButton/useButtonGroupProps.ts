import { toRefs } from 'vue'
import type IButtonGroupState from '../../composables/group/types/IButtonGroupState'

//Composables
import { useInjectedGroupState } from '../../composables/group/useInjectedGroupState'

//Constasts
import { VV_BUTTON_GROUP } from '../../constants'

import type { VvButtonPropsTypes } from './VvButton'

/**
 * Estreae tutte le prop del componente VvButton che possono essere
 * "sovrascritte" quando il buttone si trova in un gruppo.
 */
export function toButtonRefs(props: VvButtonPropsTypes) {
	const { group, isInGroup, getGroupOrLocalRef } =
		useInjectedGroupState<IButtonGroupState>(VV_BUTTON_GROUP)

	//Local props
	const { modifiers, fullBleed, iconPosition, icon, label, block } =
		toRefs(props)

	//Group based props
	const modelValue = getGroupOrLocalRef('modelValue', props)
	const disabled = getGroupOrLocalRef('disabled', props)
	const toggle = getGroupOrLocalRef('toggle', props)
	const rounded = getGroupOrLocalRef('rounded', props)

	return {
		//Group based props
		modelValue,
		disabled,
		toggle,
		isInGroup,
		group,
		//Local props
		modifiers,
		block,
		rounded,
		fullBleed,
		iconPosition,
		icon,
		label
	}
}
