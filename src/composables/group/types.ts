import type { Ref } from 'vue'

/**
 * Stato condiviso per un gruppo di elementi
 */
export interface IGroupState {
	/**
	 * Chiave usata per il provide del gruppo
	 */
	key: symbol
	/**
	 * Shared ModelValue
	 */
	modelValue: Ref<any>
	/**
	 * True = gruppo di elementi è disabilitato
	 */
	disabled: Ref<boolean>
}

/**
 * Stato condiviso per un gruppo di pulsanti
 */
export interface IButtonGroupState extends IGroupState {
	type: ButtonGroup
	/**
	 * True = gruppo di pulsanti è in modalità TOGGLE (come i radio buttons)
	 */
	toggle: Ref<boolean>
}

/**
 * Stato condiviso per in un gruppo di inputs
 */
export interface IInputGroupState extends IGroupState {
	type: InputGroup
	/**
	 * True = gruppo di elementi di input è in readonly
	 */
	readonly: Ref<boolean>
}

// All available Group States Types
export type GroupStateTypes = IInputGroupState | IButtonGroupState | IGroupState

// #region group options
export interface IGroupOptions {
	modelValue: any
	disabled: boolean
}

export interface IButtonGroupOptions extends IGroupOptions {
	toggle?: boolean
}

export interface IInputGroupOptions extends IGroupOptions {
	readonly: boolean
}
// #endregion group input options

// Available Groups
export type ButtonGroup = 'ButtonGroup'
export type InputGroup = 'InputGroup'
type GroupTypes = ButtonGroup | InputGroup

// #region type checks
export function isButtonGroupType(groupType: GroupTypes): boolean {
	return groupType === 'ButtonGroup'
}

export function isInputGroupType(groupType: GroupTypes): boolean {
	return groupType === 'InputGroup'
}
// #endregion type checks
