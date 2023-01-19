import { provide, computed, isRef } from 'vue'
import type IGroupState from '@/composables/group/types/IGroupState'

/**
 * Share part of the state of the component with all its children.
 * @param {IGroupState} groupState the group state with all group options
 */
export function useProvideGroupState<TGroup extends IGroupState>(
	groupState: TGroup,
) {
	if (
		Object.keys(groupState).some(
			(k) => k !== 'key' && !isRef(groupState[k]),
		)
	)
		throw Error("One or more groupState props aren't ref.")
	provide(
		groupState.key,
		computed(() => groupState),
	)
}
