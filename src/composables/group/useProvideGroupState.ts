import { provide, computed, isRef } from 'vue'
import type IGroupState from '@/composables/group/types/IGroupState'

/**
 * Condividi parte dello stato del componente con tutti i suoi figli.
 * @param {IGroupState} groupState the group state with all group options
 */
export function useProvideGroupState<TGroup extends IGroupState>(
	groupState: TGroup
) {
	if (
		Object.keys(groupState).some(
			(k) => k !== 'key' && !isRef(groupState[k])
		)
	)
		throw Error("One or more groupState props aren't ref.")
	provide(
		groupState.key,
		computed(() => groupState)
	)
}
