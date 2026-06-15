import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import { useVirtualScroll } from '@/composables/useVirtualScroll'

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
