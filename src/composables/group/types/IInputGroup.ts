import type { Ref } from 'vue'
import type IGroupState from './IGroupState'

/**
 * State shared in a group of inputs
 */
export interface IInputGroupState extends IGroupState {
	readonly: Ref<boolean>
}
