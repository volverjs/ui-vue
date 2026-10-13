<script setup lang="ts">
import { VvSkeletonProps } from '.'

const props = defineProps(VvSkeletonProps)

const itemsCount = computed(() => Number.parseInt(String(props.items)) || 0)

function getItemClass(index: number) {
    return Array.isArray(props.itemClass)
        ? props.itemClass[index]
        : props.itemClass
}

// styles
const { modifiers } = toRefs(props)
const bemCssClasses = useModifiers('vv-skeleton', modifiers)
</script>

<script lang="ts">
export default {
    name: 'VvSkeleton',
    // the attributes belong to the placeholder: the content it stands for can
    // be more than one element
    inheritAttrs: false,
}
</script>

<template>
    <div
        v-if="loading"
        v-bind="$attrs"
        :class="bemCssClasses"
        role="status"
        :aria-label="label"
    >
        <!-- @slot Bars of a shape of their own, each a `vv-skeleton__item`, in place of `items` -->
        <slot name="skeleton">
            <div
                v-for="index in itemsCount"
                :key="index"
                class="vv-skeleton__item"
                :class="getItemClass(index - 1)"
            />
        </slot>
    </div>
    <!-- @slot The content the placeholder stands for, shown once `loading` is false -->
    <slot v-else />
</template>
