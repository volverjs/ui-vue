import type { UseGroupOptions, UseGroupReturn } from './types'

import { provide, watch, computed, toRefs } from 'vue'
import { GroupStateManager } from './group'

/**
 * Condividi parte dello stato del componente con tutti i suoi figli.
 * Stato condiviso: ModelValue, Disabled, Readonly
 */
export function useGroup<TModelValue>(
	props: any,
	context: any,
	options: any
): UseGroupReturn<TModelValue> {
	const { key } = options
	const { emit } = context
	const { modelValue, disabled, readonly } = toRefs(props)
	const group = new GroupStateManager<TModelValue>({
		modelValue,
		disabled,
		readonly
	})

	provide(
		key,
		computed(() => group)
	)

	watch(
		() => group.modelValue,
		(newVal) => {
			emit('update:modelValue', newVal)
		},
		{
			immediate: true
		}
	)

	return {
		group
	}
}
