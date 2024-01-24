import type { InjectionKey, Ref } from 'vue'
import type { Emitter } from 'mitt'
import type { Volver } from './Volver'
import type { AlertModifiers } from './types/alert'
import type {
	AccordionGroupState,
	InputGroupState,
	ButtonGroupState,
	AlertGroupState,
} from './types'

export const DEFAULT_ICONIFY_PROVIDER = 'vv'

export enum StorageType {
	local = 'local',
	session = 'session',
}

export enum Strategy {
	absolute = 'absolute',
	fixed = 'fixed',
}

export enum Side {
	left = 'left',
	right = 'right',
	top = 'top',
	bottom = 'bottom',
}

export enum Placement {
	topStart = 'top-start',
	topEnd = 'top-end',
	bottomStart = 'bottom-start',
	bottomEnd = 'bottom-end',
	leftStart = 'left-start',
	leftEnd = 'left-end',
	rightStart = 'right-start',
	rightEnd = 'right-end',
}

export enum Position {
	before = 'before',
	after = 'after',
}

export enum ButtonType {
	button = 'button',
	submit = 'submit',
	reset = 'reset',
}

export enum ActionTag {
	nuxtLink = 'nuxt-link',
	routerLink = 'router-link',
	a = 'a',
	button = 'button',
}

export enum ActionRoles {
	button = 'button',
	link = 'link',
	menuitem = 'menuitem',
}

export enum DropdownRole {
	listbox = 'listbox',
	menu = 'menu',
}

export enum DropdownItemRole {
	option = 'option',
	presentation = 'presentation',
}

// volver
export const INJECTION_KEY_VOLVER = Symbol.for('volver') as InjectionKey<Volver>

// groups
export const INJECTION_KEY_BUTTON_GROUP = Symbol.for(
	'buttonGroup',
) as InjectionKey<ButtonGroupState>
export const INJECTION_KEY_RADIO_GROUP = Symbol.for(
	'radioGroup',
) as InjectionKey<InputGroupState>
export const INJECTION_KEY_CHECK_GROUP = Symbol.for(
	'checkGroup',
) as InjectionKey<InputGroupState>
export const INJECTION_KEY_ACCORDION_GROUP = Symbol.for(
	'accordionGroup',
) as InjectionKey<AccordionGroupState>

// dropdown
export type DropdownTriggerState = {
	id?: Ref<string | number>
	reference?: Ref<HTMLElement | null>
	bus?: Emitter<{
		click: Event
		mouseover: Event
		mouseleave: Event
	}>
	expanded?: Ref<boolean>
	aria?: Ref<{
		'aria-controls': string
		'aria-haspopup': boolean
		'aria-expanded': boolean
	}>
}
export const INJECTION_KEY_DROPDOWN_TRIGGER = Symbol.for(
	'dropdownTrigger',
) as InjectionKey<DropdownTriggerState>

export type DropdownItemState = {
	role?: Ref<`${DropdownItemRole}`>
	expanded?: Ref<boolean>
	focused?: Ref<boolean>
	hovered?: Ref<boolean>
}
export const INJECTION_KEY_DROPDOWN_ITEM = Symbol.for(
	'dropdownItem',
) as InjectionKey<DropdownItemState>

export type DropdownActionState = {
	role?: Ref<`${ActionRoles}`>
	expanded?: Ref<boolean>
}
export const INJECTION_KEY_DROPDOWN_ACTION = Symbol.for(
	'dropdownAction',
) as InjectionKey<DropdownActionState>

// alert
export const INJECTION_KEY_ALERT_GROUP = Symbol.for(
	'alertGroup',
) as InjectionKey<AlertGroupState>
export const DEFAULT_ALERT_AUTO_CLOSE = 10000
export const DEFAULT_ALERT_MODIFIERS = 'info'
export const DEFAULT_ALERT_DISMISSABLE = true
export const DEFAULT_ALERT_GROUP = 'default'
export const DEFAULT_ALERT_INFO_ICON = 'information'
export const DEFAULT_ALERT_SUCCESS_ICON = 'check-circle'
export const DEFAULT_ALERT_WARNING_ICON = 'warning'
export const DEFAULT_ALERT_DANGER_ICON = 'error'
export const DefaultAlertIconMap = new Map<AlertModifiers, string>([
	['success', DEFAULT_ALERT_SUCCESS_ICON],
	['info', DEFAULT_ALERT_INFO_ICON],
	['warning', DEFAULT_ALERT_WARNING_ICON],
	['danger', DEFAULT_ALERT_DANGER_ICON],
])
