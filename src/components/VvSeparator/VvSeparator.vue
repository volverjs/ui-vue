<script setup lang="ts">
import { VvSeparatorProps } from '.'

const props = defineProps(VvSeparatorProps)

const slots = useSlots()
const hasLabel = computed(() => Boolean(props.label || slots.default))

// styles
const { modifiers } = toRefs(props)
const bemCssClasses = useModifiers(
    'vv-separator',
    modifiers,
    computed(() => ({ vertical: props.vertical })),
)
</script>

<script lang="ts">
export default {
    name: 'VvSeparator',
}
</script>

<template>
    <!-- the children of a separator are presentational, so a label inside
         one would not be read: with a label, the line is decoration around a
         text -->
    <div v-if="hasLabel" :class="bemCssClasses">
        <span class="vv-separator__label">
            <!-- @slot Label, in place of the `label` prop -->
            <slot>{{ label }}</slot>
        </span>
    </div>
    <div
        v-else-if="vertical"
        :class="bemCssClasses"
        role="separator"
        aria-orientation="vertical"
    />
    <hr v-else :class="bemCssClasses">
</template>
