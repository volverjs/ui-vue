import type GroupState from '@/types/group'

/**
 * Share part of the state of the component with all its children.
 * @param {IGroupState} groupState the group state with all group options
 */
export function useProvideGroupState<GroupStateType extends GroupState>(
	groupState: GroupStateType,
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
