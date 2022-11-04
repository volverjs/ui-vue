import { toRefs } from 'vue'
import type { IButtonGroupState } from '../../composables/group/types'

//Composables
import { useInjectedGroupState } from '../../composables/group2/useInjectedGroupState'

//Constasts
import { VV_BUTTON_GROUP } from '../../constants'

import type { VvButtonPropsTypes } from './VvButton'

/**
 * Estreae tutte le prop del componente VvButton che possono essere
 * "sovrascritte" quando il buttone si trova in un gruppo.
 */
export function toGroupButtonRefs(
	props: VvButtonPropsTypes,
	emit: (event: any, ...args: any[]) => void
) {
	const { isInGroup, getGroupOrLocalRef } =
		useInjectedGroupState<IButtonGroupState>(VV_BUTTON_GROUP)

	//Local props
	const { modifiers, block, rounded, fullBleed, iconPosition, icon, label } =
		toRefs(props)

	//Group based props
	const modelValue = getGroupOrLocalRef(props, 'modelValue', emit)
	const disabled = getGroupOrLocalRef(props, 'disabled', emit)
	const toggle = getGroupOrLocalRef(props, 'toggle', emit)

	return {
		//Group based props
		modelValue,
		disabled,
		toggle,
		isInGroup,
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
