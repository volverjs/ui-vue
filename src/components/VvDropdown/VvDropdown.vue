<script setup lang="ts">
import type {
    AutoPlacementOptions,
    FlipOptions,
    Middleware,
    MiddlewareState,
    OffsetOptions,
    ShiftOptions,
    SizeOptions,
} from '../../types/floating-ui'
import {
    arrow,
    autoPlacement,
    autoUpdate,
    flip,
    offset,
    shift,
    size,
    useFloating,
} from '@floating-ui/vue'
import { VvDropdownProps } from '.'
import { DropdownRole, Side, Strategy } from '../../constants'

// props, emit and attrs
const props = defineProps(VvDropdownProps)

const emit = defineEmits([
    'update:modelValue',
    'beforeEnter',
    'afterLeave',
    'beforeExpand',
    'beforeCollapse',
    'afterExpand',
    'afterCollapse',
    'before-enter',
    'after-leave',
    'enter',
    'afterEnter',
    'enterCancelled',
    'beforeLeave',
    'leave',
    'leaveCancelled',
])

const { id } = toRefs(props)
const hasId = useUniqueId(id)
const attrs = useAttrs() as Record<string, unknown>

// template elements
const localReferenceEl = ref()
const floatingEl = ref()
const arrowEl = ref()
const listEl = ref()
const referenceEl = computed({
    get: () => props.reference ?? localReferenceEl.value,
    set: (newValue) => {
        localReferenceEl.value = newValue
    },
})

// top layer, through the Popover API
const {
    isTopLayer,
    popover: hasPopover,
    show: showInTopLayer,
    hide: hideFromTopLayer,
} = useTopLayer(floatingEl, () => props.topLayer)

// an element in the top layer has no offset parent to be positioned against,
// so the coordinates have to be computed on the viewport
const hasStrategy = computed(() =>
    isTopLayer.value ? Strategy.fixed : props.strategy,
)

// ref to store the value of css-var "--dropdown-custom-position"
const hasCustomPosition = ref(false)

// observe dropdown style for "--dropdown-custom-position" css var to disable floating-ui
onMounted(() => {
    useMutationObserver(
        floatingEl.value,
        () => {
            hasCustomPosition.value
                = globalThis
                    .getComputedStyle(floatingEl.value)
                    .getPropertyValue('--dropdown-custom-position')
                    ?.trim() === 'true'
        },
        {
            attributeFilter: ['style'],
            window: globalThis.window,
        },
    )
})

// floating ui

// Resolve the common "boolean enables defaults, object provides options" pattern
function resolveMiddleware<T>(
    value: boolean | T,
    whenEnabled: () => Middleware,
    whenConfigured: (options: T) => Middleware,
): Middleware {
    return typeof value === 'boolean' ? whenEnabled() : whenConfigured(value)
}

// a collapsed or hidden dropdown measures 0: its size says nothing of the room
// its items need
function isEmpty(rect: { width: number, height: number }) {
    return !rect.width && !rect.height
}

// "size" caps the dropdown to the room left, and a capped dropdown always fits
// where it is: once per pass, clear a cap the content fills, so that "flip"
// measures the height of the items, after a reopening or a change of content
const uncap: Middleware = {
    name: 'uncap',
    fn({ elements, rects, middlewareData }) {
        const { style } = elements.floating as HTMLElement
        const filled
            = rects.floating.height >= Number.parseFloat(style.maxHeight) - 1
                || rects.floating.width >= Number.parseFloat(style.maxWidth) - 1
        if (middlewareData.uncap || !filled || isEmpty(rects.floating)) {
            return {}
        }
        style.maxHeight = ''
        style.maxWidth = ''
        return { data: { uncapped: true }, reset: { rects: true } }
    },
}

// the width "triggerWidth" gives the dropdown, or 0 when it gives none: a
// custom position leaves the width to the stylesheet, and a virtual reference,
// such as the pointer of a context menu, has none to give
function getTriggerWidth(rects: MiddlewareState['rects']) {
    return props.triggerWidth && !hasCustomPosition.value
        ? rects.reference.width
        : 0
}

// "triggerWidth" gives the dropdown the width the trigger has in each pass. A
// trigger that changes width changes nothing reactive, nor the coordinates of
// a dropdown aligned to its start, so the width is read from the rects. It is
// written once per pass and the dropdown measured again, so that the
// middleware after it measure the dropdown at that width
const triggerWidth: Middleware = {
    name: 'triggerWidth',
    fn({ elements, rects, middlewareData }) {
        const { style } = elements.floating as HTMLElement
        const width = getTriggerWidth(rects)
        // the browser keeps six significant digits of the width it is given
        const written = Number.parseFloat(style.width) || 0
        if (middlewareData.triggerWidth || Math.abs(width - written) < 0.01) {
            return {}
        }
        style.width = width ? `${width}px` : ''
        return { reset: { rects: true } }
    },
}

const middleware = computed<Middleware[]>(() => {
    const toReturn: Middleware[] = []

    // first, so that the others measure the dropdown at its width
    if (props.triggerWidth) {
        toReturn.push(triggerWidth)
    }

    if (props.size) {
        toReturn.push(uncap)
    }

    // before the middleware that place the dropdown, so that they measure it
    // where the offset puts it
    if (props.offset) {
        toReturn.push(
            ['string', 'number'].includes(typeof props.offset)
                ? offset(Number(props.offset))
                : offset(props.offset as OffsetOptions),
        )
    }

    // "flip" keeps from the edge the room "size" keeps, so that it does not
    // stay on a side where the items would be capped a few pixels short
    const padding = typeof props.size === 'object' ? props.size.padding : undefined

    if (props.autoPlacement) {
        toReturn.push(
            resolveMiddleware(
                props.autoPlacement,
                () => autoPlacement(),
                options =>
                    autoPlacement(options as AutoPlacementOptions),
            ),
        )
    } else if (props.flip) {
        toReturn.push(
            resolveMiddleware(
                props.flip,
                () => flip({ fallbackStrategy: 'initialPlacement', padding }),
                options => flip({ padding, ...(options as FlipOptions) }),
            ),
        )
    }

    if (props.shift) {
        toReturn.push(
            resolveMiddleware(
                props.shift,
                () => shift(),
                options => shift(options as ShiftOptions),
            ),
        )
    }

    if (props.size) {
        // on the element and not through the template, so that "size" measures
        // the capped dropdown right away and places it on its real height
        const apply = ({
            availableWidth,
            availableHeight,
            elements,
            rects,
        }: MiddlewareState & {
            availableWidth: number
            availableHeight: number
        }) => {
            if (isEmpty(rects.floating) || hasCustomPosition.value) {
                return
            }
            const { style } = elements.floating as HTMLElement
            // as wide as the trigger, past the room left if need be
            style.maxWidth = getTriggerWidth(rects)
                ? ''
                : `${Math.max(0, availableWidth)}px`
            style.maxHeight = `${Math.max(0, availableHeight)}px`
        }
        toReturn.push(
            resolveMiddleware(
                props.size,
                () => size({ apply }),
                // an "apply" in the options runs too, after the cap
                options =>
                    size({
                        ...(options as SizeOptions),
                        apply: (state) => {
                            apply(state)
                            return (options as SizeOptions)?.apply?.(state)
                        },
                    }),
            ),
        )
    }

    if (props.arrow) {
        toReturn.push(
            arrow({
                element: arrowEl,
            }),
        )
    }

    return toReturn
})
const { x, y, middlewareData, placement, strategy, update } = useFloating(
    referenceEl,
    floatingEl,
    {
        placement: computed(() => props.placement),
        strategy: hasStrategy,
        middleware,
    },
)
const dropdownPlacement = computed(() => {
    if (hasCustomPosition.value) {
        return undefined
    }
    return {
        position: strategy.value,
        top: `${y.value ?? 0}px`,
        left: `${x.value ?? 0}px`,
    }
})
// the middleware is gone once "triggerWidth" is off, and so has to be its width
watch(
    () => props.triggerWidth,
    (value) => {
        if (!value && floatingEl.value) {
            floatingEl.value.style.width = ''
        }
    },
)

// placement
const side = computed(
    () =>
        placement.value.split('-')[0] as
        | Side.top
        | Side.right
        | Side.bottom
        | Side.left,
)
const arrowPlacement = computed(() => {
    if (hasCustomPosition.value) {
        return undefined
    }
    const staticSide = {
        [Side.top]: Side.bottom,
        [Side.right]: Side.left,
        [Side.bottom]: Side.top,
        [Side.left]: Side.right,
    }[side.value]
    return {
        left:
				middlewareData.value.arrow?.x === undefined
				    ? undefined
				    : `${middlewareData.value.arrow?.x}px`,
        top:
				middlewareData.value.arrow?.y === undefined
				    ? undefined
				    : `${middlewareData.value.arrow?.y}px`,
        [staticSide]: `${-(arrowEl.value?.offsetWidth ?? 0) / 2}px`,
    }
})

// visibility
const modelValue = useVModel(props, 'modelValue', emit)
const localModelValue = ref(false)
const expanded = computed({
    get: () => modelValue.value ?? localModelValue.value,
    set: (newValue) => {
        if (modelValue.value === undefined) {
            localModelValue.value = newValue
            return
        }
        modelValue.value = newValue
    },
})
// keep only an open dropdown in place. A collapsed one is not displayed and
// measures 0, and "size" would cap the next opening to the room left below the
// trigger. Started after the DOM is updated, the first pass measures the
// dropdown on display and caps it before the ResizeObserver reports its size
watch(
    [expanded, referenceEl, floatingEl, hasStrategy],
    ([isExpanded, reference, floating, positioning], _, onCleanup) => {
        if (!isExpanded || !reference || !floating) {
            return
        }
        onCleanup(
            autoUpdate(reference, floating, update, {
                animationFrame: positioning === Strategy.fixed,
            }),
        )
    },
    { flush: 'post', immediate: true },
)
// the items change the room the dropdown needs, which a capped dropdown does
// not show by its own size, so the ResizeObserver does not see it
useMutationObserver(
    listEl,
    () => {
        if (expanded.value) {
            update()
        }
    },
    { childList: true, subtree: true, characterData: true },
)
// promote the dropdown after the DOM is updated and before the browser paints,
// so it is never shown in place first. A post effect also covers a dropdown
// expanded on mount, and one whose "topLayer" is turned on while it is open. It
// goes back to the document flow at the end of the leave transition, see
// "after-leave"
watchPostEffect(() => {
    if (expanded.value) {
        showInTopLayer()
    }
})
function show() {
    expanded.value = true
}
function hide() {
    expanded.value = false
}
function toggle() {
    expanded.value = !expanded.value
}
function init(el: HTMLElement) {
    referenceEl.value = el
}
onClickOutside(
    floatingEl,
    () => {
        if (!props.keepOpen && expanded.value) {
            expanded.value = false
        }
    },
    { ignore: [referenceEl] },
)

// aria
const hasAriaLabelledby = computed(() => {
    return referenceEl.value?.getAttribute?.('id') ?? undefined
})
const referenceAria = computed(() => ({
    'aria-controls': hasId.value,
    'aria-haspopup': true,
    'aria-expanded': expanded.value,
}))

// provide to dropdown
const { component: VvDropdownTriggerProvider, bus }
    = useDropdownProvideTrigger({
        reference: referenceEl,
        id: hasId,
        expanded,
        aria: referenceAria,
    })
bus.on('click', toggle)

const { role, modifiers } = toRefs(props)

// styles
const bemCssClasses = useModifiers(
    'vv-dropdown',
    modifiers,
    computed(() => ({
        arrow: props.arrow,
    })),
)

// focus
const { focused } = useFocusWithin(floatingEl)
/**
 * The element with the focus in the tree that holds the dropdown. Inside a
 * shadow root `document.activeElement` is the host: the arrows read it as
 * no item and moved the focus to the first one every time.
 */
function activeElementOf(element: Element | undefined) {
    const root = element?.getRootNode() as Document | ShadowRoot | undefined
    return root?.activeElement ?? null
}
// a hidden input takes no focus, and `aria-hidden="false"` hides nothing
const KEYBOARD_FOCUSABLE
    = 'a[href], button, input:not([type="hidden"]), textarea, select, details, [tabindex]:not([tabindex="-1"])'
function isKeyboardFocusable(el: Element) {
    return (
        !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true'
    )
}
function getKeyboardFocusableElements(element: Element | null) {
    if (!element) {
        return []
    }
    return [...element.querySelectorAll(KEYBOARD_FOCUSABLE)].filter(
        isKeyboardFocusable,
    ) as HTMLElement[]
}
/**
 * True while `Esc` gives the focus back, until the watchers of that focus
 * have run: a field that opens its dropdown on focus (`VvCombobox` with
 * `autoOpen`, the suggestions of `VvInputText` and `VvTextarea`) reads it to
 * stay closed, where the dropdown opened again at once.
 */
const restoringFocus = ref(false)
/** The element that had the focus before the dropdown opened, outside it. */
let focusBeforeOpen: HTMLElement | undefined
/**
 * The element the focus goes back to on `Esc`: the reference, or the element
 * inside it that controls the dropdown (the `role="combobox"` of the wrapper
 * of `VvCombobox`), or the first one there that takes the focus outside the
 * dropdown. A virtual reference, the pointer of a context menu, is only a
 * position: there the focus goes back where it was before the dropdown opened.
 */
function referenceFocusTarget() {
    const reference = referenceEl.value?.$el ?? referenceEl.value
    if (reference instanceof HTMLElement) {
        if (
            reference.matches(KEYBOARD_FOCUSABLE)
            && isKeyboardFocusable(reference)
        ) {
            return reference
        }
        const controller = reference.querySelector<HTMLElement>(
            `[aria-controls="${CSS.escape(String(hasId.value))}"]`,
        )
        const target
            = controller && isKeyboardFocusable(controller)
                ? controller
                : getKeyboardFocusableElements(reference).find(
                        el => !floatingEl.value?.contains(el),
                    )
        if (target) {
            return target
        }
    }
    return focusBeforeOpen?.isConnected ? focusBeforeOpen : undefined
}
function focusReference() {
    const target = referenceFocusTarget()
    if (!target) {
        return
    }
    restoringFocus.value = true
    target.focus({ preventScroll: true })
    setTimeout(() => {
        restoringFocus.value = false
    })
}
/**
 * The innermost dropdown the key was pressed in. Nested dropdowns all hear
 * the same key on `window`: the outer one moved the focus or clicked the item
 * as well, so an option of a nested dropdown ran twice and the arrows skipped
 * an item. A closed shadow root hides the path, and there the focus inside
 * the dropdown's own root tells.
 */
function dropdownOfKey(e: KeyboardEvent) {
    const inPath = e
        .composedPath()
        .find(
            node =>
                node instanceof Element && node.classList.contains('vv-dropdown'),
        )
    return (
        inPath
        ?? activeElementOf(floatingEl.value)?.closest('.vv-dropdown')
        ?? undefined
    )
}
function focusFirst() {
    nextTick(() => {
        const focusableElements = getKeyboardFocusableElements(
            floatingEl.value,
        )
        if (focusableElements.length > 0) {
            focusableElements[0].focus({
                preventScroll: true,
            })
        }
    })
}
function focusFirstListElement() {
    nextTick(() => {
        const focusableElements = getKeyboardFocusableElements(
            listEl.value,
        )
        if (focusableElements.length > 0) {
            focusableElements[0].focus({
                preventScroll: true,
            })
        }
    })
}
function focusNext() {
    nextTick(() => {
        if (focused.value) {
            const focusableElements = getKeyboardFocusableElements(
                floatingEl.value,
            )
            const activeElement = activeElementOf(floatingEl.value)
            if (focusableElements.length === 0 || !activeElement) {
                return
            }
            const activeElementIndex = focusableElements.indexOf(
                activeElement as HTMLElement,
            )
            if (activeElementIndex < focusableElements.length - 1) {
                focusableElements[activeElementIndex + 1].focus({
                    preventScroll: true,
                })
            } else {
                focusableElements[0].focus({
                    preventScroll: true,
                })
            }
        }
    })
}
function focusPrev() {
    nextTick(() => {
        if (focused.value) {
            const focusableElements = getKeyboardFocusableElements(
                floatingEl.value,
            )
            const activeElement = activeElementOf(floatingEl.value)
            if (focusableElements.length === 0 || !activeElement) {
                return
            }
            const activeElementIndex = focusableElements.indexOf(
                activeElement as HTMLElement,
            )
            if (activeElementIndex > 0) {
                focusableElements[activeElementIndex - 1].focus({
                    preventScroll: true,
                })
                return
            }
            focusableElements.at(-1)?.focus({
                preventScroll: true,
            })
        }
    })
}

watch(expanded, (newValue) => {
    if (newValue) {
        const active = activeElementOf(floatingEl.value) ?? document.activeElement
        focusBeforeOpen
            = active instanceof HTMLElement && !floatingEl.value?.contains(active)
                ? active
                : undefined
    }
    if (newValue && props.autofocusFirst) {
        focusFirst()
    }
})

defineExpose({
    /** Toggle the dropdown */
    toggle,
    /** Show the dropdown */
    show,
    /** Hide the dropdown */
    hide,
    /**
     * Initialize the dropdown
     * @param {HTMLElement} el - The dropdown reference element to attach to
     */
    init,
    /** Focus the first focusable element */
    focusFirst,
    /** Focus the first focusable element in the list */
    focusFirstListElement,
    /** Focus the next focusable element */
    focusNext,
    /** Focus the previous focusable element */
    focusPrev,
    /** The dropdown has custom position */
    customPosition: hasCustomPosition,
    /** True while `Esc` gives the focus back: a field that opens the dropdown on focus stays closed */
    restoringFocus,
})

// hover
const hovered = useElementHover(floatingEl)

// the dropdown this one is nested in, read before this one provides its own
const { onAction: onParentAction } = useInjectedDropdownItem()
/**
 * An item of a menu has run: the menu closes, as a menu does, where it stayed
 * open over the view the item had opened unless each click called `hide`.
 * The focus, if it was on the item, goes back to the trigger as on `Esc`; one
 * the item moved elsewhere stays there. A nested menu closes the one it is
 * nested in too. A listbox leaves closing to the field that owns it, and
 * `keepOpen` keeps the dropdown open on an item as on a click outside.
 */
function onAction() {
    if (
        !expanded.value
        || props.keepOpen
        || role.value === DropdownRole.listbox
    ) {
        return
    }
    const active = activeElementOf(floatingEl.value)
    const focusInside = !!active && !!floatingEl.value?.contains(active)
    hide()
    if (focusInside) {
        focusReference()
    }
    onParentAction?.()
}

// provide top dropdown item
const { itemRole } = useDropdownProvideItem({
    role,
    expanded,
    focused,
    hovered,
    onAction,
})

// keyboard
onKeyStroke('Escape', (e) => {
    if (!expanded.value) {
        return
    }
    const owner = dropdownOfKey(e)
    // a dropdown nested in this one closes alone, as a submenu does, and
    // gives the focus back to the item that opened it
    if (
        owner
        && owner !== floatingEl.value
        && floatingEl.value?.contains(owner)
    ) {
        return
    }
    e.preventDefault()
    hide()
    // the focus inside the dropdown would be left on the body
    if (owner === floatingEl.value) {
        focusReference()
    }
})
onKeyStroke('ArrowDown', (e) => {
    if (expanded.value && dropdownOfKey(e) === floatingEl.value) {
        e.preventDefault()
        focusNext()
    }
})
onKeyStroke('ArrowUp', (e) => {
    if (expanded.value && dropdownOfKey(e) === floatingEl.value) {
        e.preventDefault()
        focusPrev()
    }
})
/**
 * Whether the browser handles `key` on `el` by itself: it activates a button
 * on Enter and Space, a link on Enter and a checkbox on Space, and a field
 * or an editable element keeps its keys. A click of the dropdown's own on
 * top of it ran the item twice, and a nested dropdown opened and closed at
 * once.
 */
function handlesKey(el: Element, key: string) {
    if (el instanceof HTMLElement && el.isContentEditable) {
        return true
    }
    switch (el.tagName) {
        case 'BUTTON':
        case 'SUMMARY':
        case 'INPUT':
        case 'TEXTAREA':
        case 'SELECT':
            return true
        case 'A':
        case 'AREA':
            return key === 'Enter' && el.hasAttribute('href')
        default:
            return false
    }
}
onKeyStroke([' ', 'Enter'], (e) => {
    if (!expanded.value || dropdownOfKey(e) !== floatingEl.value) {
        return
    }
    // the focused item, read in the dropdown's own root: inside a shadow
    // root the target of the key is the host
    const item = activeElementOf(floatingEl.value)
    if (item instanceof HTMLElement && !handlesKey(item, e.key)) {
        item.click()
    }
})

// the enter transition is the opening and the leave transition the closing:
// an opening during a closing cancels the leave and runs the enter hooks
const dropdownTransitionHandlers = {
    'before-enter': () => {
        emit('beforeExpand')
        emit('beforeEnter')
    },
    'after-leave': () => {
        if (!expanded.value) {
            hideFromTopLayer()
        }
        emit('afterCollapse')
        emit('afterLeave')
    },
    'enter': () => {
        emit('enter')
    },
    'after-enter': () => {
        emit('afterExpand')
        emit('afterEnter')
    },
    'enter-cancelled': () => {
        emit('enterCancelled')
    },
    'before-leave': () => {
        emit('beforeCollapse')
        emit('beforeLeave')
    },
    'leave': () => {
        emit('leave')
    },
    'leave-cancelled': () => {
        emit('leaveCancelled')
    },
}
</script>

<script lang="ts">
export default {
    name: 'VvDropdown',
    inheritAttrs: false,
}
</script>

<template>
    <VvDropdownTriggerProvider>
        <slot
            v-bind="{ init, show, hide, toggle, expanded, aria: referenceAria }"
        />
    </VvDropdownTriggerProvider>
    <Transition :name="transitionName" v-on="dropdownTransitionHandlers">
        <div
            v-show="expanded"
            ref="floatingEl"
            :popover="hasPopover"
            :style="dropdownPlacement"
            :class="bemCssClasses"
        >
            <div
                v-if="props.arrow"
                ref="arrowEl"
                :style="arrowPlacement"
                class="vv-dropdown__arrow"
            />
            <slot name="before" v-bind="{ show, hide, toggle, expanded }" />
            <div
                v-bind="attrs"
                :id="hasId"
                ref="listEl"
                :tabindex="!expanded ? -1 : undefined"
                :role="role"
                :aria-labelledby="hasAriaLabelledby"
                class="vv-dropdown__list"
            >
                <slot
                    name="items"
                    v-bind="{
                        show,
                        hide,
                        toggle,
                        expanded,
                        role: itemRole,
                    }"
                />
            </div>
            <slot name="after" v-bind="{ show, hide, toggle, expanded }" />
        </div>
    </Transition>
</template>
