import { v4 as uuidv4 } from 'uuid'

import type { Nullable } from '@/types/generic'
import type { IElementsGroup, IElementsGroupOptions } from './types'
import { unref } from 'vue'

/**
 * Gruppo di elementi.
 * @description
 * Implimentazione di un raggruppamento di elementi basato su chiave univoca.
 */
export class ElementsGroup implements IElementsGroup {
	key: Symbol
	items: Array<String>
	itemActive: Nullable<String>

	constructor(key: Symbol, options: IElementsGroupOptions) {
		if (!key) throw new Error('Key param is missing.')

		this.key = key
		this.items = []
		this.itemActive = unref(options?.defaultSelected)
	}

	contain(elementKey: String): Boolean {
		return this.items.indexOf(elementKey) > -1
	}

	add(key?: Nullable<String>): Nullable<String> {
		//C'è già
		if (key && this.items.indexOf(key) > -1) return key

		//Registra
		const _id: String = key || uuidv4()
		this.items.push(_id)
		return _id
	}

	setActive(key: Nullable<String>) {
		if (!key) return
		if (this.items.indexOf(key) == -1) return

		this.itemActive = key
	}
}
