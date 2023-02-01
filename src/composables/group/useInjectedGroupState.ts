import type { Ref } from 'vue'
import type GroupState from '@/types/group'

/**
 * Injects a group state
 */
export function useInjectedGroupState<GroupStateType extends GroupState>(
	groupKey: string | symbol,
) {
	// Get group state
	const group = inject<Ref<GroupStateType> | undefined>(groupKey, undefined)

	// Check if component is in group
	const isInGroup = computed(() => !isEmpty(group))

	/**
	 * Get a group or local property
	 */
	function getGroupOrLocalRef<PropsType extends object>(
		propName: keyof GroupStateType,
		props: PropsType,
		emit?: (event: string, ...args: unknown[]) => void,
	) {
		if (group?.value) {
			const groupPropValue = unref(group.value)[propName] as Ref<unknown>
			return computed({
				get() {
					return groupPropValue?.value
				},
				set(value: unknown) {
					groupPropValue.value = value
				},
			})
		}
		const propRef = toRef(props, propName as keyof PropsType)
		return computed({
			get() {
				return propRef.value
			},
			set(value: unknown) {
				if (emit) emit(`update:${propName as string}`, value)
			},
		})
	}

	return {
		group,
		isInGroup,
		getGroupOrLocalRef,
	}
}
