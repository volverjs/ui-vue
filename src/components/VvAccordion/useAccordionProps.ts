import { toRefs } from 'vue'
import type { VvAccordionPropsTypes, VvAccordionEvents } from './VvAccordion'
import type IAccordionGroupState from '@/composables/group/types/IAccordionGroupState'
import { useInjectedGroupState } from '@/composables/group/useInjectedGroupState'
import { VV_ACCORDION_GROUP } from '@/constants'

/**
 * Estrae tutte le prop del componente VvButton che possono essere
 * "sovrascritte" quando il buttone si trova in un gruppo.
 */
export function toAccordionRefs(
	props: VvAccordionPropsTypes,
	emit: (event: typeof VvAccordionEvents[number], value: unknown) => void
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
