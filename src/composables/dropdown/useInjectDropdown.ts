import type { Ref } from 'vue'
import type { Emitter, EventType } from 'mitt'
import {
	dropdownTriggerInjectionKey,
	dropdownItemInjectionKey,
	dropdownActionInjectionKey,
} from '@/composables/dropdown/keys'
import type { DropdownItemRole } from '@/components/VvDropdown/'

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
	return inject(dropdownTriggerInjectionKey, {})
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
	return inject(dropdownItemInjectionKey, {})
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
	return inject(dropdownActionInjectionKey, {})
}
