import type IGroupState from './types/IGroupState'
import { provide, computed } from 'vue'

/**
 * Condividi parte dello stato del componente con tutti i suoi figli.
 * @param {IGroupState} groupState the group state with all group options
 */
export function useProvideGroupState<TGroup extends IGroupState>(
	groupState: TGroup
) {
	provide(
		groupState.key,
		computed(() => groupState)
	)
}
