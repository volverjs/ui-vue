import type { Ref } from 'vue'

import type IGroupState from './IGroupState'

/**
 * Stato condiviso per in un gruppo di inputs
 */
export interface IInputGroupState extends IGroupState {
	/**
	 * True = gruppo di elementi di input è in readonly
	 */
	readonly: Ref<boolean>
}
