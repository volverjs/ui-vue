import type { Ref } from 'vue'

/**
 * State shared for a group of elements
 */
export default interface GroupState {
	// The key of the group
	[itemKey: string]: Ref<unknown> | unknown | undefined
	key: string | number | symbol
}

/**
 * State shared in a group of inputs
 */
export interface InputGroupState extends GroupState {
	readonly: Ref<boolean>
	disabled: Ref<boolean>
	valid: Ref<boolean>
	invalid: Ref<boolean>
}

/**
 * State shared in a group of buttons
 */
export interface ButtonGroupState extends GroupState {
	modelValue: Ref<string | Array<string> | undefined>
	disabled: Ref<boolean>
	toggle: Ref<boolean>
	multiple: Ref<boolean>
	unselectable: Ref<boolean>
	itemModifiers?: Ref<string | Array<string> | undefined>
}

/**
 * State shared in a group of accordions
 */
export interface AccordionGroupState extends GroupState {
	collapse: Ref<boolean>
	disabled: Ref<boolean>
	modifiers: Ref<Array<string> | string | undefined>
	not: Ref<boolean>
}
