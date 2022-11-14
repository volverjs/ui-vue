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
	 * Crea una computed ref (writable) che può utilizzare esporre il valore o dall'oggetto props oppure dal group
	 */
	function getGroupOrLocalRef<T extends object>(
		propName: keyof TGroup,
		props: T,
		emit?: (event: any, ...args: any[]) => void
	) {
		//Check se propName non è in gruppo o locale -> Spaccarsi
		if (group?.value) {
			// if (!Object.keys(group.value).includes(propName as string))
			// 	throw Error(`${propName as string} is not a group valid prop`)

			const groupPropValue = unref(group.value)[propName] as Ref<any>
			return computed({
				get() {
					return groupPropValue?.value
				},
				set(value) {
					groupPropValue.value = value
				}
			})
		} else {
			// if (!Object.keys(props).includes(propName as string))
			// 	throw Error(`${propName as string} is not a valid prop`)

			const propRef = toRef(props, propName as keyof T)
			return computed({
				get() {
					return propRef.value
				},
				set(value) {
					if (emit) emit(`update:${propName as string}`, value)
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
