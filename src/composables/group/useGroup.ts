import type { IGroupState } from './types'
import { provide, watch, computed } from 'vue'

/**
 * Condividi parte dello stato del componente con tutti i suoi figli.
 */
export function useProvideGroupState(groupState: IGroupState, emit: Function) {
	provide(
		groupState.key,
		computed(() => groupState)
	)

	watch(
		() => groupState.modelValue,
		(newVal) => {
			emit('update:modelValue', newVal)
		},
		{
			immediate: true
		}
	)
}
