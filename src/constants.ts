export const DEFAULT_ICONIFY_PROVIDER = 'vv'

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

export enum AnchorTarget {
	_blank = '_blank',
	_self = '_self',
	_parent = '_parent',
	_top = '_top',
}

// volver
export const INJECTION_KEY_VOLVER = Symbol.for('volver')

// groups
export const INJECTION_KEY_BUTTON_GROUP = Symbol.for('buttonGroup')
export const INJECTION_KEY_RADIO_GROUP = Symbol.for('radioGroup')
export const INJECTION_KEY_CHECK_GROUP = Symbol.for('checkGroup')
export const INJECTION_KEY_ACCORDION_GROUP = Symbol.for('accordionGroup')

// dropdown
export const INJECTION_KEY_DROPDOWN_TRIGGER = Symbol.for('dropdownTrigger')
export const INJECTION_KEY_DROPDOWN_ITEM = Symbol.for('dropdownItem')
export const INJECTION_KEY_DROPDOWN_ACTION = Symbol.for('dropdownAction')
