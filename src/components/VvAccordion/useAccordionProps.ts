import type { VvAccordionPropsTypes } from './VvAccordion'
import type IAccordionGroupState from '@/composables/group/types/IAccordionGroupState'

import { toRefs } from 'vue'

//Composables
import { useInjectedGroupState } from '../../composables/group/useInjectedGroupState'

//Constasts
import { VV_ACCORDION_GROUP } from '../../constants'

/**
 * Estreae tutte le prop del componente VvButton che possono essere
 * "sovrascritte" quando il buttone si trova in un gruppo.
 */
export function toAccordionRefs(
	props: VvAccordionPropsTypes,
	emit: (event: any, ...args: any[]) => void
) {
	const { group, isInGroup, getGroupOrLocalRef } =
		useInjectedGroupState<IAccordionGroupState>(VV_ACCORDION_GROUP)

	//Local props
	const { modifiers } = toRefs(props)

	//Group based props
	const modelValue = getGroupOrLocalRef('modelValue', props, emit)
	const bordered = getGroupOrLocalRef('bordered', props)
	const disabled = getGroupOrLocalRef('disabled', props)
	const iconRight = getGroupOrLocalRef('iconRight', props)
	const accordion = getGroupOrLocalRef('accordion', props)

	return {
		//Group based props
		modelValue,
		disabled,
		bordered,
		iconRight,
		isInGroup,
		group,
		accordion,
		//Local props
		modifiers
	}
}
