import type { Ref } from 'vue'

import type IGroupState from './IGroupState'

/**
 * Stato condiviso per un gruppo di pulsanti
 */
export default interface IButtonGroupState extends IGroupState {
	modelValue: Ref<string | Array<string> | undefined>
	disabled: Ref<boolean>
	toggle: Ref<boolean>
	multiple: Ref<boolean>
	unselectable: Ref<boolean>
	modifiers: Ref<string | Array<string> | undefined>
}
