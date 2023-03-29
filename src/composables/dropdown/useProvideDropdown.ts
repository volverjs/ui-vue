import { type Ref, Fragment } from 'vue'
import mitt from 'mitt'
import {
	INJECTION_KEY_DROPDOWN_TRIGGER,
	INJECTION_KEY_DROPDOWN_ACTION,
	INJECTION_KEY_DROPDOWN_ITEM,
	DropdownRole,
	DropdownItemRole,
	ActionRoles,
} from '../../constants'

/**
 * Share the dropdown reference and the event bus with all its children.
 * @param {Ref<HTMLElement | null>} reference the dropdown reference
 */
export function useProvideDropdownTrigger({
	reference,
	id,
	expanded,
	aria,
}: {
	reference: Ref<HTMLElement | null>
	id: Ref<string | number>
	expanded: Ref<boolean>
	aria: Ref<{
		'aria-controls': string
		'aria-haspopup': boolean
		'aria-expanded': boolean
	}>
}) {
	const bus = mitt()
	const component = defineComponent({
		name: 'VvDropdownTriggerProvider',
		provide() {
			return {
				[INJECTION_KEY_DROPDOWN_TRIGGER]: {
					reference,
					id,
					expanded,
					aria,
					bus,
				},
			}
		},
		setup() {
			return {}
		},
		render() {
			return h(Fragment, {}, this.$slots.default?.())
		},
	})

	return {
		bus,
		component,
	}
}

/**
 * Share the dropdown item role with all its children.
 * @param {Ref<string>} role the dropdown item role
 */
export function useProvideDropdownItem({
	role,
	expanded,
}: {
	role: Ref<`${DropdownRole}`>
	expanded: Ref<boolean>
}) {
	const itemRole = computed(() =>
		role.value === DropdownRole.listbox
			? DropdownItemRole.option
			: DropdownItemRole.presentation,
	)
	provide(INJECTION_KEY_DROPDOWN_ITEM, {
		role: itemRole,
		expanded,
	})
	return { itemRole }
}

/**
 * Share the dropdown item role with all its children.
 * @param {Ref<string>} role the dropdown item role
 */
export function useProvideDropdownAction({
	expanded,
}: {
	expanded: Ref<boolean>
}) {
	provide(INJECTION_KEY_DROPDOWN_ACTION, {
		role: ActionRoles.menuitem,
		expanded,
	})
}
