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
 * Stato condiviso per un gruppo di pulsanti
 */
export interface IAccordionGroupState extends IGroupState {
	type: AccordionGroup
	iconRight: Ref<boolean>
	bordered: Ref<boolean>
	accordion: Ref<boolean>
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
export type GroupStateTypes =
	| IGroupState
	| IAccordionGroupState
	| IInputGroupState
	| IButtonGroupState

export type GroupStateProps =
	| keyof IGroupState
	| keyof IAccordionGroupState
	| keyof IInputGroupState
	| keyof IButtonGroupState

// #region group options
export interface IGroupOptions {
	modelValue: Ref<any> | undefined
	disabled: Ref<boolean>
}

export interface IButtonGroupOptions extends IGroupOptions {
	toggle?: Ref<boolean>
}

export interface IInputGroupOptions extends IGroupOptions {
	readonly: Ref<boolean>
}

export interface IAccordionGroupOptions extends IGroupOptions {
	iconRight?: Ref<boolean>
	bordered?: Ref<boolean>
	accordion?: Ref<boolean>
}
// #endregion group input options

// Available Groups
export type ButtonGroup = 'ButtonGroup'
export type InputGroup = 'InputGroup'
export type AccordionGroup = 'AccordionGroup'
type GroupTypes = ButtonGroup | InputGroup | AccordionGroup

// #region type checks
export function isButtonGroupType(groupType: GroupTypes): boolean {
	return groupType === 'ButtonGroup'
}

export function isInputGroupType(groupType: GroupTypes): boolean {
	return groupType === 'InputGroup'
}

export function isAccordionGroupType(groupType: GroupTypes): boolean {
	return groupType === 'AccordionGroup'
}
// #endregion type checks
