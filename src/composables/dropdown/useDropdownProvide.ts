import mitt from 'mitt'
import { Fragment, type Ref } from 'vue'
import {
    ActionRoles,
    DropdownItemRole,
    type DropdownItemState,
    DropdownRole,
    INJECTION_KEY_DROPDOWN_ACTION,
    INJECTION_KEY_DROPDOWN_ITEM,
    INJECTION_KEY_DROPDOWN_TRIGGER,
} from '../../constants'

/**
 * Share the dropdown reference and the event bus with all its children.
 * @param {Ref<HTMLElement | null>} reference the dropdown reference
 */
export function useDropdownProvideTrigger({
    reference,
    id,
    expanded,
    aria,
}: {
    reference: Ref<HTMLElement | null | undefined>
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
export function useDropdownProvideItem({
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
export function useDropdownProvideAction({
    expanded,
}: {
    expanded?: Ref<boolean>
}) {
    provide(INJECTION_KEY_DROPDOWN_ACTION, {
        role: ref(ActionRoles.menuitem),
        expanded,
    })
}
