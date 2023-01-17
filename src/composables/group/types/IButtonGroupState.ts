import type { Ref } from 'vue'

import type IGroupState from './IGroupState'

/**
 * State shared in a group of buttons
 */
export default interface IButtonGroupState extends IGroupState {
	modelValue: Ref<string | Array<string> | undefined>
	disabled: Ref<boolean>
	toggle: Ref<boolean>
	multiple: Ref<boolean>
	unselectable: Ref<boolean>
	modifiers: Ref<string | Array<string> | undefined>
}
