<script setup lang="ts">
import type {
    AccordionGroupBusEvents,
    AccordionGroupState,
} from '../../types/group'
import mitt from 'mitt'
import { VvAccordionGroupEvents, VvAccordionGroupProps } from '.'
import { INJECTION_KEY_ACCORDION_GROUP } from '../../constants'
import VvAccordion from '../VvAccordion/VvAccordion.vue'

// props and emit
const props = defineProps(VvAccordionGroupProps)
const emit = defineEmits(VvAccordionGroupEvents)

// data
const {
    disabled,
    modifiers,
    itemModifiers,
    items,
    storageKey,
    storageType,
} = toRefs(props)
watchEffect(() => {
    if (typeof props.modelValue === 'string' && props.collapse) {
        console.warn(
            `[VvAccordionGroup]: modelValue is a string but collapse is true.`,
        )
    }
})

const accordionNames = reactive(new Set<string>())
const storageModelValue = usePersistence<string | string[] | undefined>(
    storageKey,
    storageType,
    [],
)
// a toggle can write the model several times before the parent passes it
// back, so until the next tick the group reads its own last write
const writtenModelValue = shallowRef<{ value?: string | string[] }>()
// a copy of that write, to tell its echo from a change made outside
let lastModelValue: string | string[] | undefined
const localModelValue = computed({
    get: () => {
        if (writtenModelValue.value) {
            return writtenModelValue.value.value
        }
        if (props.modelValue !== null && props.modelValue !== undefined) {
            return props.modelValue
        }
        return storageModelValue.value
    },
    set: (newValue): void => {
        batch(() => {
            lastModelValue = Array.isArray(newValue) ? [...newValue] : newValue
            storageModelValue.value = newValue
            if (!writtenModelValue.value) {
                nextTick(() => {
                    writtenModelValue.value = undefined
                })
            }
            writtenModelValue.value = { value: newValue }
        })
    },
})
// a toggle writes the model back for every accordion it touches, changed or
// not, so the parent hears the result once, when the outermost toggle is over
let batchDepth = 0
let batchModelValue: string | string[] | undefined
function batch(callback: () => void) {
    if (batchDepth++ === 0) {
        batchModelValue = localModelValue.value
    }
    try {
        callback()
    } finally {
        if (
            --batchDepth === 0
            && !isSameModelValue(localModelValue.value, batchModelValue)
        ) {
            emit('update:modelValue', localModelValue.value)
        }
    }
}
// an array model is a set of names: the group writes them in the order they
// registered, and a parent that keeps them in another order has not changed
// anything, so the two must not rewrite each other for ever
function isSameModelValue(
    value?: string | string[],
    otherValue?: string | string[],
) {
    if (Array.isArray(value) && Array.isArray(otherValue)) {
        const names = new Set(otherValue)
        const isSameSize = new Set(value).size === names.size
        return isSameSize && value.every(name => names.has(name))
    }
    return value === otherValue
}
const expandedAccordions = computed<Set<string>>({
    get: () => {
        if (localModelValue.value === undefined) {
            return new Set<string>()
        }
        let toReturn = new Set<string>()
        if (props.not) {
            if (typeof localModelValue.value === 'string') {
                toReturn = new Set<string>(
                    [...accordionNames].filter(
                        name => name !== localModelValue.value,
                    ),
                )
            } else if (Array.isArray(localModelValue.value)) {
                toReturn = new Set<string>(
                    [...accordionNames].filter(
                        name =>
                            !(localModelValue.value as string[]).includes(
                                name,
                            ),
                    ),
                )
            }
        } else if (typeof localModelValue.value === 'string') {
            toReturn = new Set<string>([localModelValue.value])
        } else if (Array.isArray(localModelValue.value)) {
            toReturn = new Set<string>(localModelValue.value)
        }
        return toReturn
    },
    set: (newValue) => {
        if (props.not) {
            // a closed accordion that is not registered, one removed for
            // now, keeps its place in the model
            const closed = localModelValue.value ?? []
            localModelValue.value = [
                ...(typeof closed === 'string' ? [closed] : closed).filter(
                    name => !accordionNames.has(name),
                ),
                ...[...accordionNames].filter(name => !newValue.has(name)),
            ]
            return
        }
        if (props.collapse) {
            localModelValue.value = [...newValue]
            return
        }
        localModelValue.value = newValue.values().next().value
    },
})
// send every accordion the state the model gives it
function syncAccordions() {
    batch(() => {
        for (const name of accordionNames) {
            bus.emit('toggle', {
                name,
                value: expandedAccordions.value.has(name),
            })
        }
    })
}
// accordions registered after this point get their state on register
let isSynced = false
onMounted(() => {
    nextTick(() => {
        isSynced = true
        syncAccordions()
    })
})
// a model changed by the parent, or in the storage, reaches the accordions
watch(
    () => props.modelValue ?? storageModelValue.value,
    (newValue) => {
        if (!isSynced || isSameModelValue(newValue, lastModelValue)) {
            return
        }
        // the change supersedes a write the parent has not passed back
        writtenModelValue.value = undefined
        syncAccordions()
    },
    { deep: true },
)

// provide
const bus = mitt<AccordionGroupBusEvents>()
useGroupStateProvide<AccordionGroupState>(INJECTION_KEY_ACCORDION_GROUP, {
    disabled,
    modifiers: itemModifiers,
    bus,
})
// two accordions share a name for a moment while they swap names, so a name
// leaves the group only when no accordion holds it any more
const registrations = new Map<string, number>()
bus.on('register', ({ name }) => {
    registrations.set(name, (registrations.get(name) ?? 0) + 1)
    accordionNames.add(name)
    if (!isSynced) {
        return
    }
    // added or renamed, the accordion takes the state of its name, and
    // where only one can be open, the one already open wins, as on mount
    const isExpanded = expandedAccordions.value.has(name)
    const isOtherExpanded = [...expandedAccordions.value].some(
        item => item !== name,
    )
    bus.emit('toggle', {
        name,
        value: isExpanded && (props.collapse || !isOtherExpanded),
    })
})
bus.on('unregister', ({ name }) => {
    const count = (registrations.get(name) ?? 0) - 1
    if (count > 0) {
        registrations.set(name, count)
        return
    }
    registrations.delete(name)
    accordionNames.delete(name)
})
bus.on('toggle', ({ name, value }) => batch(() => {
    const newValue = new Set<string>(expandedAccordions.value)
    if (value) {
        if (!props.collapse) {
            for (const item of newValue) {
                if (item !== name) {
                    bus.emit('toggle', { name: item, value: false })
                }
            }
            newValue.clear()
        }
        newValue.add(name)
        expandedAccordions.value = newValue
        return
    }
    newValue.delete(name)
    expandedAccordions.value = newValue
}))
function expand(name?: string | string[]) {
    batch(() => {
        if (typeof name === 'string') {
            bus.emit('toggle', { name, value: true })
            return
        }
        if (Array.isArray(name)) {
            for (const item of name) {
                bus.emit('toggle', { name: item, value: true })
            }
            return
        }
        for (const item of accordionNames) {
            bus.emit('toggle', { name: item, value: true })
        }
    })
}
bus.on('expand', ({ name }) => expand(name))

function collapse(name?: string | string[]) {
    batch(() => {
        if (typeof name === 'string') {
            bus.emit('toggle', { name, value: false })
            return
        }
        if (Array.isArray(name)) {
            for (const item of name) {
                bus.emit('toggle', { name: item, value: false })
            }
            return
        }
        for (const item of accordionNames) {
            bus.emit('toggle', { name: item, value: false })
        }
    })
}
bus.on('collapse', ({ name }) => collapse(name))

// expose
defineExpose({
    /** Expanded accordions names */
    expandedAccordions,
    /** Expand accordion by name, expand all if no name is provided */
    expand,
    /** Collapse accordion by name, collapse all if no name is provided */
    collapse,
})

// styles
const bemCssClasses = useModifiers(
    'vv-accordion-group',
    modifiers,
    computed(() => ({
        disabled: disabled.value,
    })),
)
</script>

<script lang="ts">
export default {
    name: 'VvAccordionGroup',
}
</script>

<template>
    <div :class="bemCssClasses">
        <!-- @slot Default slot -->
        <slot
            v-bind="{
                expandedAccordions,
                expand,
                collapse,
            }"
        >
            <VvAccordion
                v-for="item in items"
                :key="item.title"
                v-bind="{
                    name: item.name,
                    title: item.title,
                    content: item.content,
                }"
            >
                <template
                    v-if="$slots[`summary::${item.name}`]"
                    #summary="data"
                >
                    <!-- @slot Slot for accordion header -->
                    <slot v-bind="data" :name="`summary::${item.name}`" />
                </template>
                <template
                    v-if="$slots[`content::${item.name}`]"
                    #default="data"
                >
                    <!-- @slot Slot for accordion details -->
                    <slot v-bind="data" :name="`content::${item.name}`" />
                </template>
            </VvAccordion>
        </slot>
    </div>
</template>
