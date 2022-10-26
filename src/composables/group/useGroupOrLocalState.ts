import type { ComputedRef, Ref } from 'vue'
import {
	isButtonGroupType,
	isInputGroupType,
	type GroupStateTypes,
	type IGroupState
} from './types'
import type { ButtonGroupState, InputGroupState } from './models'

import { inject, computed, unref, watch, ref } from 'vue'
import ObjectUtilities from '../../utils/ObjectUtilities'

export interface UseGroupOrLocalStateReturn {
	group: Ref<IGroupState> | undefined
	modelValue: Ref<any>
	isInGroup: ComputedRef<boolean>
	isDisabled: ComputedRef<boolean>
	isReadonly: ComputedRef<boolean | undefined>
	isToggleEnabled: ComputedRef<boolean>
	checkIsSelected: (value: any) => boolean
}

/**
 * Utilizza lo stato locale o quello del gruppo di appartenenza.
 * @param {symbol} groupKey the group symbol key (VV_BUTTON_GROUP, VV_RADIO_GROUP, VV_CHECK_GROUP, ...)
 * @param {GroupStateTypes} localState the component group state with component options (modelValue, disabled, ...)
 */
export function useGroupOrLocalState(
	groupKey: symbol,
	localState: GroupStateTypes
): UseGroupOrLocalStateReturn {
	//Recupera, se esiste, lo stato condiviso fornito da un parent "group"
	const group = inject<Ref<GroupStateTypes> | undefined>(groupKey, undefined)

	//Check if component is in group
	const isInGroup = computed(() => ObjectUtilities.isNotEmpty(group))

	//#region Sync model value
	const modelValue = ref(isInGroup.value ? localState.modelValue.value : null)
	if (group) {
		//Set default child modelValue to group modelValue
		modelValue.value = unref(group).modelValue.value

		// watch of child modelValue and set of parent modelValue
		watch(modelValue, (value) => {
			unref(group).modelValue.value = value
		})

		// watch of parent modelValue and set of child modelValue
		watch(unref(group).modelValue, (value) => {
			if (!ObjectUtilities.equals(value, modelValue.value)) {
				modelValue.value = value
			}
		})
	}
	//#endregion Sync model value

	//#region Computed prop per le shared props
	const isDisabled = computed(() => {
		return !!(unref(group)?.disabled.value || localState?.disabled?.value)
	})
	const isToggleEnabled = computed(() => {
		if (
			group &&
			'type' in group.value &&
			isButtonGroupType(group.value.type)
		) {
			const btnGroupState = unref(group) as ButtonGroupState
			return btnGroupState.toggle.value
		}
		return false
	})
	const isReadonly = computed(() => {
		if (
			group &&
			'type' in group.value &&
			isInputGroupType(group.value.type)
		) {
			const inputGroupState = unref(group) as InputGroupState
			const childState = localState as InputGroupState
			return inputGroupState.readonly.value || childState?.readonly?.value
		}
		return (localState as InputGroupState)?.readonly || false
	})
	//#endregion Computed prop per le shared props

	const checkIsSelected = (value: any) => {
		let isSelected = false
		if (Array.isArray(modelValue.value)) {
			isSelected = ObjectUtilities.contains(value, modelValue.value)
		} else {
			isSelected =
				ObjectUtilities.isNotEmpty(modelValue.value) &&
				ObjectUtilities.equals(modelValue.value, value)
		}
		return isSelected
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
