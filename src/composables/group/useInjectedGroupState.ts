import type { Ref, InjectionKey } from 'vue'

/**
 * Injects a group state
 */
export function useInjectedGroupState<GroupStateType>(
	groupKey: InjectionKey<GroupStateType>,
) {
	// Get group state
	const group = inject<GroupStateType | undefined>(groupKey, undefined)

	// Check if component is in group
	const isInGroup = computed(() => group !== undefined)

	/**
	 * Get a group or local property
	 */
	function getGroupOrLocalRef<
		TProps extends object,
		TName extends keyof GroupStateType,
	>(
		propName: TName,
		props: TProps,
		emit?: (event: string, ...args: unknown[]) => void,
	) {
		const groupPropValue = group?.[propName] as Ref | undefined
		if (groupPropValue) {
			return computed({
				get() {
					return groupPropValue.value
				},
				set(value: unknown) {
					groupPropValue.value = value
				},
			}) as GroupStateType[TName]
		}
		const propRef = toRef(props, propName as unknown as keyof TProps)
		return computed({
			get() {
				return propRef.value
			},
			set(value: unknown) {
				if (emit) {
					emit(`update:${propName as string}`, value)
				}
			},
		}) as GroupStateType[TName]
	}

	return {
		group,
		isInGroup,
		getGroupOrLocalRef,
	}
}
