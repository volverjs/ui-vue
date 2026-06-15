<script setup lang="ts" generic="ListItem extends (Record<string | number | symbol, any> | string | number | symbol)">
import type { Component } from 'vue'
import type { ScrollToOptions } from '@/composables/useVirtualScroll'
import { useVirtualScroll } from '@/composables/useVirtualScroll'

const props = withDefaults(defineProps<{
    items: ListItem[]
    estimateSize: string | number | ((index: number) => number)
    wrapperTag?: string | Component
    itemTag?: string | Component
    itemProps?: Record<string, unknown> | ((index: number) => Record<string, unknown>)
    startSpacerProps?: Record<string, unknown>
    endSpacerProps?: Record<string, unknown>
    startSpacerTag?: string | Component
    endSpacerTag?: string | Component
    overscan?: string | number
    getItemKey?: (index: number) => number | string
    horizontal?: boolean
    focusable?: boolean
}>(), {
    wrapperTag: 'ul',
    itemTag: 'li',
    getItemKey: (index: number) => index,
    overscan: 10,
    horizontal: false,
    focusable: true,
})

const scrollEl = ref<HTMLElement | null>(null)

const wrapperRole = computed(() =>
    typeof props.wrapperTag === 'string'
    && ['ul', 'ol', 'menu'].includes(props.wrapperTag)
        ? undefined
        : 'list',
)
const itemRole = computed(() =>
    typeof props.itemTag === 'string' && props.itemTag === 'li'
        ? undefined
        : 'listitem',
)

const {
    virtualizer,
    virtualItems,
    startSpacer,
    endSpacer,
} = useVirtualScroll({
    scrollEl,
    count: computed(() => props.items.length),
    estimateSize: computed(() => props.estimateSize),
    getItemKey: props.getItemKey,
    overscan: computed(() => props.overscan),
    horizontal: computed(() => props.horizontal),
})

watch(
    [
        () => props.items.length,
        () => props.estimateSize,
        () => props.horizontal,
        () => props.overscan,
    ],
    () => {
        nextTick(() => virtualizer.value?.measure())
    },
)

function getElementAtIndex(index: number) {
    return props.items[index]
}

function scrollToIndex(index: number, options?: ScrollToOptions) {
    virtualizer.value?.scrollToIndex(index, options)
}

function scrollToOffset(offset: number, options?: ScrollToOptions) {
    virtualizer.value?.scrollToOffset(offset, options)
}

defineExpose({
    virtualizer,
    getElementAtIndex,
    scrollToIndex,
    scrollToOffset,
    measure: () => virtualizer.value?.measure(),
})
</script>

<template>
    <component
        :is="wrapperTag"
        ref="scrollEl"
        :tabindex="focusable ? 0 : undefined"
        :role="wrapperRole"
    >
        <component
            :is="startSpacerTag || itemTag"
            v-if="startSpacer.show"
            v-bind="startSpacerProps"
            :style="startSpacer.style"
            aria-hidden="true"
            role="presentation"
        />
        <component
            :is="itemTag"
            v-for="({ index, start, end, key }, virtualIndex) in virtualItems"
            :key="key"
            v-bind="typeof itemProps === 'function' ? itemProps(index) : itemProps"
            :role="itemRole"
        >
            <slot v-bind="{ item: getElementAtIndex(index), start, end, index, virtualIndex, scrollToIndex, scrollToOffset, virtualizer }" />
        </component>
        <component
            :is="endSpacerTag || itemTag"
            v-if="endSpacer.show"
            v-bind="endSpacerProps"
            :style="endSpacer.style"
            aria-hidden="true"
            role="presentation"
        />
    </component>
</template>
