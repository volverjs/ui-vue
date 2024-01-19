import type { Ref } from 'vue'
import type { Emitter } from 'mitt'

/**
 * State shared in a group of inputs
 */
export type InputGroupState = {
	modelValue: Ref<unknown>
	readonly: Ref<boolean>
	disabled: Ref<boolean>
	valid: Ref<boolean>
	invalid: Ref<boolean>
}

/**
 * State shared in a group of buttons
 */
export type ButtonGroupState = {
	modelValue: Ref<
		string | number | boolean | (string | number | boolean)[] | undefined
	>
	disabled: Ref<boolean>
	toggle: Ref<boolean>
	multiple: Ref<boolean>
	unselectable: Ref<boolean>
	modifiers: Ref<string | string[] | undefined>
}

/**
 * State shared in a group of accordions
 */
export type AccordionGroupBusEvents = {
	toggle: { name: string; value: boolean }
	register: { name: string }
	unregister: { name: string }
	expand: { name?: string | string[] }
	collapse: { name?: string | string[] }
}
export type AccordionGroupState = {
	disabled: Ref<boolean>
	modifiers: Ref<string[] | string | undefined>
	bus: Emitter<AccordionGroupBusEvents>
}

/**
 * State shared in a group of alerts
 */
export type AlertGroupBusEvents = { close: string }
export type AlertGroupState = {
	name?: Ref<string | undefined>
	bus?: Emitter<AlertGroupBusEvents>
}
