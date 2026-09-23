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
        // every toggle writes the model back, changed or not
        if (!isSameModelValue(newValue, localModelValue.value)) {
            emit('update:modelValue', newValue)
        }
        storageModelValue.value = newValue
        if (!writtenModelValue.value) {
            nextTick(() => {
                writtenModelValue.value = undefined
            })
        }
        writtenModelValue.value = { value: newValue }
    },
})
function isSameModelValue(
    value?: string | string[],
    otherValue?: string | string[],
) {
    if (Array.isArray(value) && Array.isArray(otherValue)) {
        return (
            value.length === otherValue.length
            && value.every((item, index) => item === otherValue[index])
        )
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
            localModelValue.value = [...accordionNames].filter(
                name => !newValue.has(name),
            )
            return
        }
        if (props.collapse) {
            localModelValue.value = [...newValue]
            return
        }
        localModelValue.value = newValue.values().next().value
    },
})
// accordions registered after this point get their state on register
let isSynced = false
onMounted(() => {
    nextTick(() => {
        isSynced = true
        for (const name of accordionNames) {
            bus.emit('toggle', {
                name,
                value: expandedAccordions.value.has(name),
            })
        }
    })
})

// provide
const bus = mitt<AccordionGroupBusEvents>()
useGroupStateProvide<AccordionGroupState>(INJECTION_KEY_ACCORDION_GROUP, {
    disabled,
    modifiers: itemModifiers,
    bus,
})
bus.on('register', ({ name }) => {
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
    accordionNames.delete(name)
})
bus.on('toggle', ({ name, value }) => {
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
})
function expand(name?: string | string[]) {
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
}
bus.on('expand', ({ name }) => expand(name))

function collapse(name?: string | string[]) {
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
