<script setup lang="ts">
import { VvBadgeProps } from '.'

const props = defineProps(VvBadgeProps)

const { modifiers } = toRefs(props)
const bemCssClasses = useModifiers('vv-badge', modifiers)
</script>

<script lang="ts">
export default {
    name: 'VvBadge',
}
</script>

<template>
    <span :class="bemCssClasses">
        <!-- @slot Default slot -->
        <slot>{{ value }}</slot>
    </span>
</template>
