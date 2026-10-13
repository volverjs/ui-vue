<script setup lang="ts">
import { VvMarkerProps } from '.'
import VvIcon from '../VvIcon/VvIcon.vue'

const props = defineProps(VvMarkerProps)

const { modifiers, icon } = toRefs(props)
const { hasIcon } = useComponentIcon(icon)

// styles
const bemCssClasses = useModifiers('vv-marker', modifiers)
</script>

<script lang="ts">
export default {
    name: 'VvMarker',
}
</script>

<template>
    <div :class="bemCssClasses">
        <!-- @slot Icon, in place of the `icon` prop: give it the `vv-marker__icon` class -->
        <slot name="icon">
            <VvIcon v-if="hasIcon" v-bind="hasIcon" class="vv-marker__icon" />
        </slot>
        <span class="vv-marker__content">
            <!-- @slot Text of the note, in place of the `label` prop -->
            <slot>{{ label }}</slot>
        </span>
    </div>
</template>
