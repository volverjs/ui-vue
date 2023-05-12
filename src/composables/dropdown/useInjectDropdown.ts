import {
	INJECTION_KEY_DROPDOWN_TRIGGER,
	INJECTION_KEY_DROPDOWN_ACTION,
	INJECTION_KEY_DROPDOWN_ITEM,
} from '../../constants'

/**
 * Injects dropdown reference and the event bus
 */
export function useInjectedDropdownTrigger() {
	return inject(INJECTION_KEY_DROPDOWN_TRIGGER, {})
}

/**
 * Injects dropdown item role
 */
export function useInjectedDropdownItem() {
	return inject(INJECTION_KEY_DROPDOWN_ITEM, {})
}

/**
 * Injects dropdown action role
 */
export function useInjectedDropdownAction() {
	return inject(INJECTION_KEY_DROPDOWN_ACTION, {})
}
