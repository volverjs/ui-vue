import type { GroupStateTypes } from './types'
import { provide, watch, computed } from 'vue'

/**
 * Condividi parte dello stato del componente con tutti i suoi figli.
 * @param {IGroupState} groupState the group state with all group options
 * @param {Function} emit the vue component emit function to bind parent data
 */
export function useProvideGroupState(
	groupState: GroupStateTypes,
	emit: (event: 'update:modelValue', args: any) => void
) {
	provide(
		groupState.key,
		computed(() => groupState)
	)

	watch(
		groupState.modelValue,
		(newVal) => {
			emit('update:modelValue', newVal)
		},
		{
			immediate: true
		}
	)
}
