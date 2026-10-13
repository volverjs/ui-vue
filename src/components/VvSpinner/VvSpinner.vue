<script setup lang="ts">
import { VvSpinnerProps } from '.'

const props = defineProps(VvSpinnerProps)

// alone, the spinner is a status named by its label; next to a visible text
// that says the same, it is decoration
const hasAttrs = computed(() =>
    props.decorative
        ? { 'aria-hidden': 'true' as const }
        : { 'role': 'status', 'aria-label': props.label },
)

// styles
const { modifiers } = toRefs(props)
const bemCssClasses = useModifiers('vv-spinner', modifiers)
</script>

<script lang="ts">
export default {
    name: 'VvSpinner',
}
</script>

<template>
    <span :class="bemCssClasses" v-bind="hasAttrs" />
</template>
