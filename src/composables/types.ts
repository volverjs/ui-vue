import type { Ref } from 'vue'

export interface IElementsGroup {
	/**
	 * Chiave del gruppo
	 */
	key: Symbol

	/**
	 * Elementi del gruppo
	 */
	items: Ref<Array<String>>

	/**
	 * Elemento selezionato/attivo
	 */
	itemActive: Ref<String | null>

	/**
	 * Aggiungi al gruppo.
	 * @param {String} key - chiave dell'elemento da inserire
	 * @return {String} Se gia presente, la stessa chiave. Se manca la nuova chiave per l'elemento.
	 */
	add(key?: String | null): String

	/**
	 * Imposta l'elemento come attivo
	 * @param {String} key - chiave dell'elemento da impostare
	 */
	setActive(key: String | null): void
}

export interface IElementsGroupOptions {
	/**
	 * Id dell'elemento selezionato
	 */
	defaultSelected: Ref<String | null | undefined> | String
}
