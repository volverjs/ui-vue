import type { Ref } from 'vue'

import type IGroupState from './IGroupState'

export type ButtonGroup = 'ButtonGroup'

/**
 * Stato condiviso per un gruppo di pulsanti
 */
export default interface IButtonGroupState extends IGroupState {
	/**
	 * Type for check
	 */
	type: ButtonGroup
	/**
	 * Singolo bottone selezionato - utilizzo un id (o un name)
	 */
	modelValue: Ref<string>
	/**
	 * Stato disabilitato
	 */
	disabled: Ref<boolean>
	/**
	 * True = gruppo di pulsanti è in modalità TOGGLE (come i radio buttons)
	 */
	toggle: Ref<boolean>
}
