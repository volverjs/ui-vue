<script setup lang="ts">
import type {
    AutoPlacementOptions,
    FlipOptions,
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
import { Side, Strategy } from '../../constants'

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
const maxWidth = ref('auto')
const maxHeight = ref('auto')

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

// ref to store the value of css-var "--dropdown-custom-position"
const hasCustomPosition = ref(false)

// observe dropdown style for "--dropdown-custom-position" css var to disable floating-ui
onMounted(() => {
    useMutationObserver(
        floatingEl.value,
        () => {
            hasCustomPosition.value
					= window
                    .getComputedStyle(floatingEl.value)
                    .getPropertyValue('--dropdown-custom-position')
                    ?.trim() === 'true'
        },
        {
            attributeFilter: ['style'],
            window,
        },
    )
})

// floating ui
const middleware = computed(() => {
    const toReturn = []

    if (props.autoPlacement) {
        if (typeof props.autoPlacement === 'boolean') {
            toReturn.push(autoPlacement())
        } else {
            toReturn.push(
                autoPlacement(props.autoPlacement as AutoPlacementOptions),
            )
        }
    } else if (props.flip) {
        if (typeof props.flip === 'boolean') {
            toReturn.push(flip({ fallbackStrategy: 'initialPlacement' }))
        } else {
            toReturn.push(flip(props.flip as FlipOptions))
        }
    }

    if (props.shift) {
        if (typeof props.shift === 'boolean') {
            toReturn.push(shift())
        } else {
            toReturn.push(shift(props.shift as ShiftOptions))
        }
    }

    if (props.size) {
        const apply = ({
            availableWidth,
            availableHeight,
        }: {
            availableWidth: number
            availableHeight: number
        }) => {
            maxWidth.value = `${availableWidth}px`
            maxHeight.value = `${availableHeight}px`
        }
        if (typeof props.size === 'boolean') {
            toReturn.push(
                size({
                    apply,
                }),
            )
        } else {
            toReturn.push(
                size({
                    ...(props.size as SizeOptions),
                    apply,
                }),
            )
        }
    }

    if (props.offset) {
        toReturn.push(offset(Number(props.offset)))

        if (['string', 'number'].includes(typeof props.offset)) {
            toReturn.push(offset(Number(props.offset)))
        } else {
            toReturn.push(offset(props.offset as OffsetOptions))
        }
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
const { x, y, middlewareData, placement, strategy } = useFloating(
    referenceEl,
    floatingEl,
    {
        whileElementsMounted: (...args) => {
            return autoUpdate(...args, {
                animationFrame: props.strategy === Strategy.fixed,
            })
        },
        placement: computed(() => props.placement),
        strategy: computed(() => props.strategy),
        middleware,
    },
)
const dropdownPlacement = computed(() => {
    if (hasCustomPosition.value) {
        return undefined
    }
    const width
			= props.triggerWidth && referenceEl.value
			    ? `${referenceEl.value?.offsetWidth}px`
			    : undefined
    return {
        position: strategy.value,
        top: `${y.value ?? 0}px`,
        left: `${x.value ?? 0}px`,
        maxWidth: width ? undefined : maxWidth.value,
        maxHeight: maxHeight.value,
        width,
    }
})

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
				middlewareData.value.arrow?.x !== undefined
				    ? `${middlewareData.value.arrow?.x}px`
				    : undefined,
        top:
				middlewareData.value.arrow?.y !== undefined
				    ? `${middlewareData.value.arrow?.y}px`
				    : undefined,
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
function getKeyboardFocusableElements(element: Element | null) {
    if (!element) {
        return []
    }
    return [
        ...element.querySelectorAll(
            'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])',
        ),
    ].filter(
        el =>
            !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'),
    ) as HTMLElement[]
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
            if (focusableElements.length === 0 || !document.activeElement) {
                return
            }
            const activeElementIndex = focusableElements.indexOf(
                document.activeElement as HTMLElement,
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
            if (focusableElements.length === 0 || !document.activeElement) {
                return
            }
            const activeElementIndex = focusableElements.indexOf(
                document.activeElement as HTMLElement,
            )
            if (activeElementIndex > 0) {
                focusableElements[activeElementIndex - 1].focus({
                    preventScroll: true,
                })
            } else {
                focusableElements[focusableElements.length - 1].focus({
                    preventScroll: true,
                })
            }
        }
    })
}

watch(expanded, (newValue) => {
    if (newValue && props.autofocusFirst) {
        focusFirst()
    }
})

defineExpose({
    toggle,
    show,
    hide,
    init,
    focusFirst,
    focusFirstListElement,
    focusNext,
    focusPrev,
    customPosition: hasCustomPosition,
})

// hover
const hovered = useElementHover(floatingEl)

// provide top dropdown item
const { itemRole } = useDropdownProvideItem({
    role,
    expanded,
    focused,
    hovered,
})

// keyboard
onKeyStroke('Escape', (e) => {
    if (expanded.value) {
        e.preventDefault()
        hide()
    }
})
onKeyStroke('ArrowDown', (e) => {
    if (expanded.value && focused.value) {
        e.preventDefault()
        focusNext()
    }
})
onKeyStroke('ArrowUp', (e) => {
    if (expanded.value && focused.value) {
        e.preventDefault()
        focusPrev()
    }
})
onKeyStroke([' ', 'Enter'], (e) => {
    const htmlEl = e.target as HTMLElement

    if (expanded.value && focused.value && htmlEl) {
        htmlEl?.click()
    }
})

const dropdownTransitionHandlers = {
    'before-enter': () => {
        emit(expanded.value ? 'beforeExpand' : 'beforeCollapse')
        emit('beforeEnter')
    },
    'after-leave': () => {
        emit(expanded.value ? 'afterExpand' : 'afterCollapse')
        emit('afterLeave')
    },
    'enter': () => {
        emit('enter')
    },
    'after-enter': () => {
        emit('afterEnter')
    },
    'enter-cancelled': () => {
        emit('enterCancelled')
    },
    'before-leave': () => {
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
            :style="dropdownPlacement"
            :class="bemCssClasses"
        >
            <div
                v-if="props.arrow"
                ref="arrowEl"
                :style="arrowPlacement"
                class="vv-dropdown__arrow"
            />
            <slot name="before" v-bind="{ expanded }" />
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
                        role: itemRole,
                    }"
                />
            </div>
            <slot name="after" v-bind="{ expanded }" />
        </div>
    </Transition>
</template>
