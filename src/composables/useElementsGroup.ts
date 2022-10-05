import {
	ref,
	unref,
	provide,
	inject,
	watch,
	onMounted,
	getCurrentInstance,
	computed,
	type Ref
} from 'vue'
import type {
	IElementsGroup,
	IElementsGroupOptions,
	IUseCurrentElementGroup
} from './types'
import type { Nullable } from '@/types/generic'
import { ElementsGroup } from './provide'

/**
 * Inizializza un gruppo di elementi.
 * @description
 * Inizializza un'istanza di un gruppo di elementi (reattiva)
 * Esegue la Dependency Injection per tutti i figli dell'istanza
 * Aggiorna il modelValue (data binding)
 */
export function useElementGroup(
	key: Symbol,
	options: IElementsGroupOptions
): Ref<IElementsGroup> {
	const { emit } = getCurrentInstance() as any
	const group = ref(new ElementsGroup(key, options))

	//Provide group ai discendenti
	provide(group.value.key, group)

	//Binding modelValue
	watch(
		() => group.value.itemActive,
		(newValue) => {
			emit('update:modelValue', newValue)
		},
		{
			immediate: true
		}
	)

	return group
}

/**
 * Recupera il gruppo al quale appartiene l'istanza corrente.
 * @return {IElementsGroup|Null} gruppo di appartenenza dell'elemento
 */
export function useCurrentElementGroup(
	groupKey: Symbol,
	elementKey?: String
): IUseCurrentElementGroup {
	let groupId: Symbol = groupKey
	let group: Ref<IElementsGroup | null> = ref(inject(groupKey, null) || null)
	let groupElementId: Ref<Nullable<String>> = ref(null)

	//Computed di supporto
	const isInGroup = computed(() =>
		unref(group)?.contain(groupElementId.value)
	)
	const isElementActive = computed(
		() =>
			isInGroup.value && unref(group)?.itemActive === groupElementId.value
	)

	onMounted(() => {
		//Registra elemento nel gruppo.
		groupElementId.value = unref(group)?.add(elementKey) || null
	})

	return {
		groupId,
		group,
		groupElementId,
		isInGroup,
		isElementActive
	}
}
