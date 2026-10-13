<script setup lang="ts">
import { VvEmptyProps } from '.'
import VvIcon from '../VvIcon/VvIcon.vue'

const props = defineProps(VvEmptyProps)

const { modifiers, icon } = toRefs(props)
const { hasIcon } = useComponentIcon(icon)

// styles
const bemCssClasses = useModifiers('vv-empty', modifiers)
</script>

<script lang="ts">
export default {
    name: 'VvEmpty',
}
</script>

<template>
    <div :class="bemCssClasses">
        <div v-if="hasIcon || $slots.media" class="vv-empty__media">
            <!-- @slot Media, an icon or an illustration, in place of the `icon` prop -->
            <slot name="media">
                <VvIcon v-if="hasIcon" v-bind="hasIcon" />
            </slot>
        </div>
        <component
            :is="titleTag"
            v-if="title || $slots.title"
            class="vv-empty__title"
        >
            <!-- @slot Title, in place of the `title` prop -->
            <slot name="title">
                {{ title }}
            </slot>
        </component>
        <p v-if="description || $slots.description" class="vv-empty__description">
            <!-- @slot Description, in place of the `description` prop -->
            <slot name="description">
                {{ description }}
            </slot>
        </p>
        <div v-if="$slots.default" class="vv-empty__actions">
            <!-- @slot The way out: the actions, or any content under the description -->
            <slot />
        </div>
    </div>
</template>
