import { type Ref, Fragment } from 'vue'
import mitt from 'mitt'
import {
	type DropdownItemState,
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
	const bus = mitt<{
		click: Event
		mouseover: Event
		mouseleave: Event
	}>()
	const component = defineComponent({
		name: 'VvDropdownTriggerProvider',
		setup() {
			provide(INJECTION_KEY_DROPDOWN_TRIGGER, {
				reference,
				id,
				expanded,
				aria,
				bus,
			})
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
	...others
}: Omit<DropdownItemState, 'role'> & {
	role: Ref<`${DropdownRole}`>
}) {
	const itemRole = computed(() =>
		role.value === DropdownRole.listbox
			? DropdownItemRole.option
			: DropdownItemRole.presentation,
	)
	provide(INJECTION_KEY_DROPDOWN_ITEM, {
		role: itemRole,
		...others,
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
	expanded?: Ref<boolean>
}) {
	provide(INJECTION_KEY_DROPDOWN_ACTION, {
		role: ref(ActionRoles.menuitem),
		expanded,
	})
}
