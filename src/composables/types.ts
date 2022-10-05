import type { Nullable } from '@/types/generic'
import type { ComputedRef, Ref } from 'vue'

/**
 * Gruppo di elementi
 * @description
 * Oggetti  IElementsGroup rappresnetano un insieme di elementi relazionati tra loro.
 */
export interface IElementsGroup {
	/**
	 * Chiave del gruppo
	 */
	key: Symbol

	/**
	 * Elementi del gruppo
	 */
	items: Array<String>

	/**
	 * Elemento selezionato/attivo
	 */
	itemActive: Nullable<String>

	/**
	 * Aggiungi al gruppo.
	 * @param {String} elementKey - chiave dell'elemento da inserire
	 * @return {String} Se gia presente, la stessa chiave. Se manca la nuova chiave per l'elemento.
	 */
	add(elementKey?: Nullable<String>): Nullable<String>

	/**
	 * Imposta l'elemento come attivo
	 * @param {String} elementKey - chiave dell'elemento da impostare
	 */
	setActive(elementKey: Nullable<String>): void

	/**
	 * Controlla se la chiave è presente nel gruppo
	 */
	contain(elementKey?: Nullable<String>): Boolean
}

/**
 * Opzioni per inizializzare un raggruppamento
 */
export interface IElementsGroupOptions {
	/**
	 * Chiave dell'elemento selezionato
	 */
	defaultSelected: Nullable<String> | Ref<Nullable<String>>
}

/**
 * Api gruppo corrente al quale appartiene l'elemento
 */
export interface IUseCurrentElementGroup {
	/**
	 * Id del gruppo di appartenenza
	 */
	groupId: Symbol
	/**
	 * Gruppo
	 */
	group: Ref<IElementsGroup | null>
	/**
	 * Id elemento nel gruppo
	 */
	groupElementId: Ref<Nullable<String>>
	/**
	 * True = presente nel gruppo
	 */
	isInGroup: ComputedRef<Boolean | undefined>
	/**
	 * True = elemento selezionato nel gruppo.
	 */
	isElementInGroupActive: ComputedRef<Boolean | undefined>
}
