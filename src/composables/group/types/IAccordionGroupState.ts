import type { Ref } from 'vue'

import type IGroupState from './IGroupState'

/**
 * Stato condiviso per un gruppo di pulsanti
 */
export default interface IAccordionGroupState extends IGroupState {
	iconRight: Ref<boolean>
	bordered: Ref<boolean>
	accordion: Ref<boolean>
}
