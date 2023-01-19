import { type Ref, toRef, unref, inject, computed } from 'vue'
import type IGroupState from '@/composables/group/types/IGroupState'
import { isEmpty } from '@/utils/ObjectUtilities'

/**
 * Injects a group state
 */
export function useInjectedGroupState<TGroup extends IGroupState>(
	groupKey: string,
) {
	// Get group state
	const group = inject<Ref<TGroup> | undefined>(groupKey, undefined)

	// Check if component is in group
	const isInGroup = computed(() => !isEmpty(group))

	/**
	 * Get a group or local property
	 */
	function getGroupOrLocalRef<PropsType extends object>(
		propName: keyof TGroup,
		props: PropsType,
		emit?: (event: string, ...args: unknown[]) => void,
	) {
		if (group?.value) {
			const groupPropValue = unref(group.value)[propName] as Ref<unknown>
			return computed({
				get() {
					return groupPropValue?.value
				},
				set(value) {
					groupPropValue.value = value
				},
			})
		}
		const propRef = toRef(props, propName as keyof PropsType)
		return computed({
			get() {
				return propRef.value
			},
			set(value) {
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
