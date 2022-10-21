import type { ComputedRef, Ref } from 'vue'
import {
	isIButtonGroupState,
	isIInputGroupState,
	type IGroupState
} from './types'
import type {
	ButtonGroupState,
	GroupParentState,
	InputGroupState
} from './group'

import { inject, computed, unref, watch, ref } from 'vue'
import ObjectUtilities from '../../utils/ObjectUtilities'

export interface UseGroupOrLocalStateReturn {
	group: Ref<IGroupState> | null
	modelValue: Ref<any>
	isInGroup: ComputedRef<boolean>
	isDisabled: ComputedRef<boolean>
	isReadonly: ComputedRef<boolean>
	isToggleEnabled: ComputedRef<boolean>
	checkIsSelected: (value: any) => boolean
}

/**
 * Utilizza lo stato locale o quello del gruppo di appartenenza.
 */
export function useGroupOrLocalState(
	groupKey: symbol,
	localState: GroupParentState
): UseGroupOrLocalStateReturn {
	//Recupera, se esiste, lo stato condiviso fornito da un parent "group"
	const group: Ref<IGroupState> | null = inject<Ref<IGroupState> | null>(
		groupKey,
		null
	)

	//Check is in group
	const isInGroup = computed(() => ObjectUtilities.isNotEmpty(group))

	//#region Sync model value
	const modelValue = ref(localState.modelValue.value)
	if (group) {
		//Set modelValue di gruppo
		modelValue.value = unref(group).modelValue.value

		//Figlio -> Padre
		watch(modelValue, (value) => {
			unref(group).modelValue.value = value
		})

		//Padre -> Figli
		watch(
			() => unref(group).modelValue.value,
			(value) => {
				if (!ObjectUtilities.equals(value, modelValue.value)) {
					modelValue.value = value
				}
			}
		)
	}
	//#endregion Sync model value

	//#region Computed prop per le shared props
	const isDisabled = computed(() => {
		return !!(unref(group)?.disabled.value || localState?.disabled?.value)
	})
	const isToggleEnabled = computed(() => {
		if (group && isIButtonGroupState(group.value)) {
			const btnGroupState = unref(group) as ButtonGroupState
			return btnGroupState.toggle.value
		}
		return false
	})
	const isReadonly = computed(() => {
		if (group && isIInputGroupState(group.value)) {
			const inputGroupState = unref(group) as InputGroupState
			return inputGroupState.readonly.value || localState?.readonly?.value
		}
		return false
	})
	//#endregion Computed prop per le shared props

	const checkIsSelected = (value: any) => {
		if (Array.isArray(modelValue.value))
			return ObjectUtilities.contains(value, modelValue.value)
		else
			return (
				ObjectUtilities.isNotEmpty(modelValue.value) &&
				ObjectUtilities.equals(modelValue.value, value)
			)
	}

	return {
		group,
		modelValue,
		isInGroup,
		isDisabled,
		isReadonly,
		isToggleEnabled,
		checkIsSelected
	}
}

// const {isInGroup, group} = useGroupItem(KEY)
// const {modelValue, isDisabled, isReadonly} = useGroupOrLocalState(group, {
//     modelValue: props.modelValue,
//     disabled: props.disabled,
//     readonly: props.readonly
// }, emit)
