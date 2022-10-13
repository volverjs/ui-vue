import type { UseGroupOptions, UseGroupReturn } from './types'

import { provide, watch, computed } from 'vue'
import { GroupStateManager } from './group'

/**
 * Condividi parte dello stato del componente con tutti i suoi figli.
 * Stato condiviso: ModelValue, Disabled, Readonly
 */
export function useGroup<TModelValue>(
	key: Symbol,
	options: UseGroupOptions
): UseGroupReturn<TModelValue> {
	const { emit, props } = options
	const { modelValue, disabled, readonly } = props
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
