import type { Ref } from 'vue'

import type IGroupState from './IGroupState'

/**
 * State shared in a group of accordions
 */
export default interface IAccordionGroupState extends IGroupState {
	collapse: Ref<boolean>
	modifiers: Ref<Array<string> | string | undefined>
}
