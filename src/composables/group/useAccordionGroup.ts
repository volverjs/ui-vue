import type { AccordionGroupState } from '../../composables/group/models'
import { computed, unref } from 'vue'
import type { IAccordionGroupState } from '../../composables/group/types'
import { useGroupOrLocalState } from '../../composables/group/useGroupOrLocalState'

/**
 * Utilizza lo stato locale o quello del gruppo di appartenenza.
 * @param {symbol} groupKey the group symbol key (VV_ACCORDION_GROUP)
 * @param {GroupStateTypes} localState the component group state with component options (modelValue, disabled, ...)
 */
export function useAccordionGroup(
	groupKey: symbol,
	localState: IAccordionGroupState
) {
	//Recupera, se esiste, lo stato condiviso fornito da un parent "group"
	const { group, modelValue, isInGroup, isDisabled } = useGroupOrLocalState(
		groupKey,
		localState
	)

	const accordionGroup = unref(group) as AccordionGroupState

	const hasIconRight = computed(() => {
		return accordionGroup?.iconRight?.value || localState?.iconRight?.value
	})

	const isBordered = computed(() => {
		return accordionGroup?.bordered?.value || localState?.bordered?.value
	})

	const isAccordionMode = computed(() => {
		return accordionGroup?.accordion?.value
	})

	return {
		group,
		modelValue,
		isInGroup,
		isDisabled,
		hasIconRight,
		isBordered,
		isAccordionMode
	}
}
