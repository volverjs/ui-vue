import type { Ref, WritableComputedRef, ComputedRef } from 'vue'

/**
 * Stato condiviso da un nodo PADRE ad un gruppo di elementi figli.
 */
export interface IGroupState {
	/**
	 * Chiave usata per il provide del gruppo
	 */
	key: Symbol
	/**
	 * Shared ModelValue
	 */
	modelValue: Ref<any>
	/**
	 * True = gruppo di elementi è disabilitato
	 */
	disabled: Ref<Boolean>
}

/**
 * Stato condiviso per in un gruppo di pulsanti
 */
export interface IButtonGroupState extends IGroupState {
	type: 'ButtonGroup'
	/**
	 * True = gruppo di pulsanti è in modalità TOGGLE (come i radio buttons)
	 */
	toggle: Ref<Boolean>
}

/**
 * Stato condiviso per in un gruppo di inputs
 */
export interface IInputGroupState extends IGroupState {
	type: 'InputGroup'
	/**
	 * True = gruppo di elementi di input è in readonly
	 */
	readonly: Ref<Boolean>
}

export function isIButtonGroupState(obj: any): Boolean {
	return 'type' in obj && obj.type === 'ButtonGroup'
}

export function isIInputGroupState(obj: any): Boolean {
	return 'type' in obj && obj.type === 'InputGroup'
}
