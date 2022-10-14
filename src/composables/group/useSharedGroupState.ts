import type { Ref } from 'vue'
import type {
	IGroupState,
	UseGroupOptions,
	UseSharedGroupStateReturn
} from './types'

import { toRefs, inject, computed, unref } from 'vue'
import ObjectUtilities from '../../utils/ObjectUtilities'

/**
 * Crea un "wrapper" per poter utilizzare lo stato condiviso con il padre se sono in un gruppo.
 * @description
 * Se sono in un gruppo, usa lo stato condiviso del padre.
 * Altrimenti utilizza lo stato del componenete.
 */
export function useSharedGroupState<TModelValue>(
	props: any,
	context: any,
	options: any
): UseSharedGroupStateReturn<TModelValue> {
	const { emit } = context
	//Recupera lo stato del componente
	const { modelValue, disabled, readonly } = toRefs(props)
	//Recupera, se esiste, lo stato condiviso fornito da un parent "group"
	let group: Ref<IGroupState<TModelValue>> | null = inject(options.key, null)

	const isInGroup = computed(() => ObjectUtilities.isNotEmpty(group))
	const wrappedModelValue = computed({
		get: () => {
			let _value: TModelValue | null
			if (isInGroup.value) _value = unref(group)?.modelValue || null
			else _value = modelValue?.value
			return _value
		},
		set: (value) => {
			if (!isInGroup.value) {
				emit('update:modelValue', value)
				return
			}

			unref(group)?.setModelValue(value)
		}
	})
	const isDisabled = computed(() => {
		return !!(isInGroup.value ? unref(group)?.disabled : disabled?.value)
	})
	const isReadonly = computed(() => {
		return !!(isInGroup.value ? unref(group)?.readonly : readonly?.value)
	})

	const checkIsSelected = (value: any) => {
		if (Array.isArray(wrappedModelValue.value))
			return ObjectUtilities.contains(value, wrappedModelValue.value)
		else
			return (
				ObjectUtilities.isNotEmpty(wrappedModelValue.value) &&
				ObjectUtilities.equals(wrappedModelValue.value, value)
			)
	}

	return {
		group,
		wrappedModelValue,
		isInGroup,
		isDisabled,
		isReadonly,
		checkIsSelected
	}
}
