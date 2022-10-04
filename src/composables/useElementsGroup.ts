import { ref, provide, inject, isRef, onMounted, type Ref } from 'vue'
import type { IElementsGroup, IElementsGroupOptions } from './types'
import { v4 as uuidv4 } from 'uuid'

class ElementsGroup implements IElementsGroup {
	key: Symbol
	items: Ref<Array<String>>
	itemActive: Ref<String | null>

	constructor(key: Symbol, options: IElementsGroupOptions) {
		if (!key) throw new Error('Key param is missing.')

		this.key = key
		this.items = ref([])
		this.itemActive = isRef(options.defaultSelected)
			? options.defaultSelected
			: ref(options.defaultSelected || null)
	}

	add(key?: String | null) {
		//C'è già
		if (key && this.items.value.indexOf(key) > -1) return key

		//Registra
		const _id: String = key || uuidv4()
		this.items.value.push(_id)
		return _id
	}

	setActive(key: String | null) {
		if (!key) return
		if (this.items.value.indexOf(key) == -1) return

		this.itemActive.value = key
	}
}

/**
 * Composable per la gestione di un gruppo di elementi.
 */
export function useElementGroup(key: Symbol, options: IElementsGroupOptions) {
	const group = new ElementsGroup(key, options)

	//Provide group ai discendenti
	provide(group.key, group)

	return {
		group
	}
}

/**
 * Composable per la gestione del componente come elemento di un gruppo.
 * @return {IElementsGroup|Null} gruppo di appartenenza dell'elemento
 */
export function useElementGroupItem(key: Symbol): IElementsGroup | null {
	let groupElementId: Ref<String | null> = ref(null)
	const group: IElementsGroup | null = inject(key, null)

	if (group) {
		//Registra elemento nel gruppo.
		onMounted(() => {
			groupElementId.value = (group as IElementsGroup).add()
		})
	}

	return {
		groupElementId,
		group
	}
}
