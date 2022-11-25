import type { VvButtonPropsTypes } from './VvButton'
import type IButtonGroupState from '@/composables/group/types/IButtonGroupState'
import { toRefs } from 'vue'
import { useInjectedGroupState } from '@/composables/group/useInjectedGroupState'
import { VV_BUTTON_GROUP } from '@/constants'

/**
 * Estrae tutte le prop del componente VvButton che possono essere
 * "sovrascritte" quando il buttone si trova in un gruppo.
 */
export function toButtonRefs(props: VvButtonPropsTypes) {
	const { group, isInGroup, getGroupOrLocalRef } =
		useInjectedGroupState<IButtonGroupState>(VV_BUTTON_GROUP)

	//Local props
	const { iconPosition, icon, label, selected } = toRefs(props)

	//Group based props
	const modelValue = getGroupOrLocalRef('modelValue', props)
	const disabled = getGroupOrLocalRef('disabled', props)
	const toggle = getGroupOrLocalRef('toggle', props)
	const modifiers = getGroupOrLocalRef('modifiers', props)

	return {
		//Group based props
		modelValue,
		disabled,
		toggle,
		isInGroup,
		group,
		modifiers,
		//Local props
		selected,
		iconPosition,
		icon,
		label
	}
}
