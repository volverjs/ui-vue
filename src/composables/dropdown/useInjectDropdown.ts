import type { Ref } from 'vue'
import type { Emitter, EventType } from 'mitt'
import type { DropdownItemRole } from '@/components/VvDropdown/'
import {
	INJECTION_KEY_DROPDOWN_TRIGGER,
	INJECTION_KEY_DROPDOWN_ACTION,
	INJECTION_KEY_DROPDOWN_ITEM,
} from '@/constants'

/**
 * Injects dropdown reference and the event bus
 */
export function useInjectedDropdownTrigger():
	| {
			id: Ref<string | number>
			reference: Ref<HTMLElement | null>
			bus: Emitter<Record<EventType, unknown>>
			expanded: Ref<boolean>
			aria: Ref<{
				'aria-controls': string
				'aria-haspopup': boolean
				'aria-expanded': boolean
			}>
	  }
	| Record<string, never> {
	return inject(INJECTION_KEY_DROPDOWN_TRIGGER, {})
}

/**
 * Injects dropdown item role
 */
export function useInjectedDropdownItem():
	| {
			role: Ref<DropdownItemRole>
			expanded: Ref<boolean>
	  }
	| Record<string, never> {
	return inject(INJECTION_KEY_DROPDOWN_ITEM, {})
}

/**
 * Injects dropdown action role
 */
export function useInjectedDropdownAction():
	| {
			role: string
			expanded: Ref<boolean>
	  }
	| Record<string, never> {
	return inject(INJECTION_KEY_DROPDOWN_ACTION, {})
}
