<script setup lang="ts">
import { VvActionEvents, VvActionProps } from '.'
import { ActionRoles, ActionTag } from '../../constants'

// props and emit
const props = defineProps(VvActionProps)

const emit = defineEmits(VvActionEvents)

const instance = getCurrentInstance()

// inject plugin
const volver = useVolver()

const rootEl = ref<HTMLElement | null>(null)
defineExpose({
    /** Reference to the root element */
    $el: rootEl,
})

// drowpdown trigger
const {
    reference: dropdownTriggerReference,
    bus: dropdownEventBus,
    aria: dropdownAria,
    expanded: dropdownExpanded,
} = useInjectedDropdownTrigger()
watch(
    () => rootEl.value,
    (newValue) => {
        if (dropdownTriggerReference) {
            dropdownTriggerReference.value = newValue
        }
    },
)

// pressed
const pressed = computed(() => {
    return props.pressed || dropdownExpanded?.value
})

// dropdown parent
const { role, onAction: onDropdownAction } = useInjectedDropdownAction()

/**
 * @description The tag defined by props.
 * @returns {string} The tag.
 */
const hasTag = computed(() => {
    switch (true) {
        case props.disabled:
            return ActionTag.button
        case props.to !== undefined:
            return volver?.nuxt ? resolveComponent(ActionTag.nuxtLink) : ActionTag.routerLink
        case props.href !== undefined:
            return ActionTag.a
        default:
            return props.defaultTag // button
    }
})

/**
 * @description Define component attributes.
 * @returns {object} The component attributes.
 */
const hasProps = computed(() => {
    const toReturn = {
        ...dropdownAria?.value,
        // A dropdown it opens says it is open through `aria-expanded`, which
        // `dropdownAria` carries, and a `menuitem` takes no `aria-pressed`:
        // the nested trigger of a menu was invalid while its menu was open
        ariaPressed:
            props.pressed && role?.value !== ActionRoles.menuitem
                ? true
                : undefined,
        ariaLabel: props.ariaLabel,
        role: role?.value,
    }
    switch (hasTag.value) {
        case ActionTag.a:
            return {
                ...toReturn,
                href: props.href,
                target: props.target,
                rel: props.rel,
            }
        case ActionTag.routerLink:
        case ActionTag.nuxtLink:
            return {
                ...toReturn,
                to: props.to,
                target: props.target,
            }
        case ActionTag.button:
            return {
                ...toReturn,
                type: props.type,
                disabled: props.disabled,
            }
        default:
            return toReturn
    }
})

/**
 * @description Catch click event
 */
function onClick(e: Event) {
    if (props.disabled) {
        e.preventDefault()
        return
    }
    // an item of a menu closes it, unless it opens a dropdown of its own;
    // before the click handlers, so that one that opens a dialog or moves
    // the focus has the last word
    if (!dropdownTriggerReference) {
        onDropdownAction?.()
    }
    if (instance?.vnode.props?.onClick) {
        emit('click', e)
        return
    }
    dropdownEventBus?.emit('click', e)
}

/**
 * @description Catch mouseover event
 */
function onMouseover(e: Event) {
    if (instance?.vnode.props?.onMouseover) {
        emit('mouseover', e)
        return
    }
    dropdownEventBus?.emit('mouseover', e)
}

/**
 * @description Catch mouseleave event
 */
function onMouseleave(e: Event) {
    if (instance?.vnode.props?.onMouseleave) {
        emit('mouseleave', e)
        return
    }
    dropdownEventBus?.emit('mouseleave', e)
}
</script>

<script lang="ts">
export default {
    name: 'VvAction',
}
</script>

<template>
    <component
        v-bind="hasProps"
        :is="hasTag"
        ref="rootEl"
        :class="{
            active,
            pressed,
            disabled,
            current,
        }"
        @click.passive="onClick"
        @mouseover.passive="onMouseover"
        @mouseleave.passive="onMouseleave"
    >
        <!-- @slot Default slot -->
        <slot>
            {{ label }}
        </slot>
    </component>
</template>
