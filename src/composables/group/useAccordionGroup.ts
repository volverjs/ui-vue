import type { AccordionGroupState } from '../../composables/group/models'
import { computed, unref, type ComputedRef, type Ref } from 'vue'
import type { IAccordionGroupState } from '../../composables/group/types'
import { useGroupOrLocalState } from './useGroupOrLocalState'
import ObjectUtilities from '../../utils/ObjectUtilities'

export interface UseAccordionGroupReturn {
	modelValue: Ref<any>
	isInGroup: ComputedRef<boolean>
	isDisabled: ComputedRef<boolean>
	hasIconRight: ComputedRef<boolean>
	isBordered: ComputedRef<boolean>
	isAccordionMode: ComputedRef<boolean>
	isSelectedInGroup: ComputedRef<boolean>
}

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

	// init group modelValue
	if (isInGroup.value && !modelValue.value) {
		modelValue.value = isAccordionMode.value ? '' : []
	}

	const isSelectedInGroup: ComputedRef<boolean> = computed(() => {
		if (modelValue.value && isInGroup.value) {
			return isAccordionMode.value
				? modelValue.value === localState.modelValue.value
				: modelValue.value.includes(localState.modelValue.value)
		}
		return false
	})

	const toggleElement = () => {
		if (isAccordionMode.value) {
			modelValue.value = isSelectedInGroup.value
				? null
				: localState.modelValue.value
		} else {
			modelValue.value = isSelectedInGroup.value
				? ObjectUtilities.removeFromList(
						localState.modelValue.value,
						modelValue.value
				  )
				: [...modelValue.value, localState.modelValue.value]
		}
	}

	return {
		modelValue,
		isInGroup,
		isDisabled,
		hasIconRight,
		isBordered,
		isAccordionMode,
		isSelectedInGroup,
		toggleElement
	}
}
