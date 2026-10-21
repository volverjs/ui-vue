import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref } from 'vue'
import { useVirtualScroll } from '@/composables/useVirtualScroll'
import { createSizedItems } from './VirtualScroll.settings'
import { flexContainerTest, reorderTest } from './VirtualScroll.test'

const meta: Meta = {
    title: 'Composables/useVirtualScroll',
    tags: ['autodocs'],
}

export default meta

export const Default: StoryObj = {
    render: function DefaultRender(args) {
        return {
            setup() {
                const items = Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`)
                const scrollEl = ref<HTMLElement | null>(null)
                const { virtualItems, startSpacer, endSpacer } = useVirtualScroll({
                    scrollEl,
                    count: items.length,
                    estimateSize: 51,
                    overscan: 10,
                })

                return { args, scrollEl, virtualItems, startSpacer, endSpacer, items }
            },
            template: /* html */ `
			<ul class="h-256 overflow-auto border border-surface-3" ref="scrollEl" tabindex="0">
                <li 
                    v-if="startSpacer.show" 
                    :style="startSpacer.style" 
                    aria-hidden="true"></li>
                <li
                    v-for="virtualItem in virtualItems"
                    :key="virtualItem.key"
                    class="p-16 border-b border-surface-3 flex gap-sm items-center"
                >
                    {{ items[virtualItem.index] }}
                </li>
                <li 
                    v-if="endSpacer.show" 
                    :style="endSpacer.style" 
                    aria-hidden="true"></li>
			</ul>
		`,
        }
    },
    parameters: {
        docs: {
            canvas: {
                sourceState: 'shown',
            },
            source: {
                code: `<script setup lang="ts">
    import { ref } from 'vue'
    import { useVirtualScroll } from '@volverjs/ui-vue/composables'

    const items = Array.from({ length: 1000 }, (_, i) => \`Item \${i + 1}\`)
    const scrollEl = ref<HTMLElement | null>(null)
    const { virtualItems, startSpacer, endSpacer } = useVirtualScroll({
        scrollEl,
        count: items.length,
        estimateSize: 51,
        overscan: 10,
    })
</script>

<template>
  <ul class="h-256 overflow-auto border border-surface-3" ref="scrollEl" tabindex="0">
    <li 
      v-if="startSpacer.show" 
      :style="startSpacer.style" 
      aria-hidden="true"
    />
    <li
      v-for="virtualItem in virtualItems"
      :key="virtualItem.key"
      class="p-16 border-b border-surface-3 flex gap-sm items-center"
    >
      {{ items[virtualItem.index] }}
    </li>
    <li 
      v-if="endSpacer.show" 
      :style="endSpacer.style" 
      aria-hidden="true"
    />
  </ul>
</template>`,
            },
        },
    },
}

export const FlexColumn: StoryObj<{ estimateSize: number }> = {
    args: {
        estimateSize: 51,
    },
    render: function FlexColumnRender(args) {
        return {
            setup() {
                const items = Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`)
                const scrollEl = ref<HTMLElement | null>(null)
                const { virtualItems, startSpacer, endSpacer } = useVirtualScroll({
                    scrollEl,
                    count: items.length,
                    estimateSize: args.estimateSize,
                    overscan: 10,
                })

                return { scrollEl, virtualItems, startSpacer, endSpacer, items }
            },
            template: /* html */ `
			<ul class="h-256 overflow-auto border border-surface-3 flex flex-col" ref="scrollEl" tabindex="0" data-testId="virtual-scroll">
                <li v-if="startSpacer.show" :style="startSpacer.style" aria-hidden="true"></li>
                <li
                    v-for="virtualItem in virtualItems"
                    :key="virtualItem.key"
                    class="shrink-0 p-16 border-b border-surface-3"
                >
                    {{ items[virtualItem.index] }}
                </li>
                <li v-if="endSpacer.show" :style="endSpacer.style" aria-hidden="true"></li>
			</ul>
		`,
        }
    },
    play: flexContainerTest,
}

export const Reorder: StoryObj = {
    render: function ReorderRender() {
        return {
            setup() {
                const items = ref(createSizedItems())
                const scrollEl = ref<HTMLElement | null>(null)
                // a new function for each order, so the measured sizes follow their rows
                const getItemKey = computed(() => {
                    const list = items.value
                    return (index: number) => list[index].label
                })
                const { virtualizer, virtualItems, startSpacer, endSpacer } = useVirtualScroll({
                    scrollEl,
                    count: items.value.length,
                    estimateSize: 51,
                    getItemKey,
                    overscan: 10,
                })
                const measureElement = (el: unknown) => virtualizer.value.measureElement(el as Element | null)
                const moveToTop = () => {
                    const list = [...items.value]
                    items.value = [...list.splice(2, 1), ...list]
                }

                return { scrollEl, virtualItems, startSpacer, endSpacer, items, measureElement, moveToTop }
            },
            template: /* html */ `
			<button class="vv-button mb-md" @click="moveToTop">Move to top</button>
			<ul class="h-256 overflow-auto border border-surface-3" ref="scrollEl" tabindex="0" data-testId="virtual-scroll">
                <li v-if="startSpacer.show" :style="startSpacer.style" aria-hidden="true"></li>
                <li
                    v-for="virtualItem in virtualItems"
                    :key="virtualItem.key"
                    :ref="measureElement"
                    :data-index="virtualItem.index"
                    :data-size="virtualItem.size"
                    class="px-16 border-b border-surface-3 flex items-center"
                    :style="{ height: items[virtualItem.index].height + 'px' }"
                >
                    {{ items[virtualItem.index].label }}
                </li>
                <li v-if="endSpacer.show" :style="endSpacer.style" aria-hidden="true"></li>
			</ul>
		`,
        }
    },
    play: reorderTest,
}
