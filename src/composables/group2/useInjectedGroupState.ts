import type IGroupState from './types/IGroupState'
import { toRef, unref, type Ref } from 'vue'

import { inject, computed } from 'vue'
import ObjectUtilities from '../../utils/ObjectUtilities'

/**
 * Esegue l'inject dello stato condiviso da un componente padre.
 */
export function useInjectedGroupState<TGroup extends IGroupState>(
	groupKey: symbol
) {
	//Recupera, se esiste, lo stato condiviso fornito da un parent "group"
	const group = inject<Ref<TGroup> | undefined>(groupKey, undefined)

	//Check if component is in group
	const isInGroup = computed(() => ObjectUtilities.isNotEmpty(group))

	/**
	 *
	 */
	function getGroupOrLocalRef<T extends object>(
		props: T,
		propName: keyof TGroup,
		emit: (event: any, ...args: any[]) => void
	) {
		if (group?.value) {
			const groupPropValue = unref(group.value)[propName] as Ref<any>
			return computed({
				get() {
					return groupPropValue.value
				},
				set(value) {
					groupPropValue.value = value
				}
			})
		} else {
			const propRef = toRef(props, propName as keyof T)
			return computed({
				get() {
					return propRef.value
				},
				set(value) {
					emit(`update:${propName as string}`, value)
				}
			})
		}
	}

	return {
		group,
		isInGroup,
		getGroupOrLocalRef
	}
}
