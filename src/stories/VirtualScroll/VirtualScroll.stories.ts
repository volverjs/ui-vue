import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VvVirtualScroll from '@/components/VvVirtualScroll/VvVirtualScroll.vue'
import { argTypes, createSizedItems, defaultArgs } from './VirtualScroll.settings'
import { changeOptionsTest, defaultTest, flexContainerTest, reorderTest } from './VirtualScroll.test'

const meta: Meta<typeof VvVirtualScroll> = {
    title: 'Components/VirtualScroll',
    component: VvVirtualScroll as any,
    args: defaultArgs,
    argTypes,
    tags: ['autodocs'],
}

export default meta

export type Story = StoryObj<typeof VvVirtualScroll>

export const Default: Story = {
    args: {
        ...defaultArgs,
        estimateSize: 51,
        itemProps: { class: 'p-16 border-b border-surface-3 flex gap-sm items-center' },
    },
    render: args => ({
        components: { VvVirtualScroll },
        setup() {
            return { args }
        },
        template: /* html */ `
			<vv-virtual-scroll v-bind="args" class="h-256 overflow-auto border border-surface-3" data-testId="virtual-scroll">
                <template #default="{ item, index, virtualIndex, start, end }">
                    <div class="w-80">{{ item }}</div>
                    <div class="text-smaller text-word-3">
                        real-index: {{ index }} | virtual-index: {{ virtualIndex }} | start: {{ start }}px | end: {{ end }}px
                    </div>
                </template>
            </vv-virtual-scroll>
		`,
    }),
    play: defaultTest,
}

export const Horizontal: Story = {
    args: {
        ...defaultArgs,
        horizontal: true,
        estimateSize: 144,
        itemProps: { class: 'w-144 shrink-0 p-16 border-r border-surface-3 flex flex-col gap-sm h-full' },
    },
    render: args => ({
        components: { VvVirtualScroll },
        setup() {
            return { args }
        },
        template: /* html */ `
			<vv-virtual-scroll v-bind="args" class="overflow-auto border border-surface-3 flex min-w-0" data-testId="virtual-scroll">
                <template #default="{ item, index, virtualIndex, start, end }">
                    <div class="w-80">{{ item }}</div>
                    <ul class="text-smaller text-word-3">
                        <li>real-index: {{ index }}</li>
                        <li>virtual-index: {{ virtualIndex }}</li>
                        <li>start: {{ start }}px</li>
                        <li>end: {{ end }}px</li>
                    </ul>
                </template>
            </vv-virtual-scroll>
		`,
    }),
    play: async (context) => {
        await defaultTest(context)
        await flexContainerTest(context)
    },
}

export const FlexColumn: Story = {
    args: {
        ...defaultArgs,
        estimateSize: 51,
        itemProps: { class: 'shrink-0 p-16 border-b border-surface-3' },
    },
    render: args => ({
        components: { VvVirtualScroll },
        setup() {
            return { args }
        },
        template: /* html */ `
			<vv-virtual-scroll v-bind="args" class="h-256 overflow-auto border border-surface-3 flex flex-col" data-testId="virtual-scroll">
                <template #default="{ item }">
                    {{ item }}
                </template>
            </vv-virtual-scroll>
		`,
    }),
    play: async (context) => {
        await defaultTest(context)
        await flexContainerTest(context)
    },
}

export const Reorder: Story = {
    render: () => ({
        components: { VvVirtualScroll },
        setup() {
            const items = ref(createSizedItems())
            const estimateSize = (index: number) => items.value[index].height
            // in place, with the same count
            const moveToTop = () => items.value.unshift(...items.value.splice(2, 1))
            return { items, estimateSize, moveToTop }
        },
        template: /* html */ `
			<button class="vv-button mb-md" @click="moveToTop">Move to top</button>
			<vv-virtual-scroll :items="items" :estimate-size="estimateSize" class="h-256 overflow-auto border border-surface-3" data-testId="virtual-scroll">
                <template #default="{ item, start, end }">
                    <div class="px-16 border-b border-surface-3 flex items-center" :style="{ height: item.height + 'px' }" :data-size="end - start">
                        {{ item.label }}
                    </div>
                </template>
            </vv-virtual-scroll>
		`,
    }),
    play: reorderTest,
}

export const ChangeOptions: Story = {
    render: () => ({
        components: { VvVirtualScroll },
        setup() {
            const overscan = ref(10)
            const horizontal = ref(false)
            return { items: defaultArgs.items, overscan, horizontal }
        },
        template: /* html */ `
			<div class="flex gap-md mb-md">
                <button class="vv-button" @click="overscan = 0">No overscan</button>
                <button class="vv-button" @click="horizontal = !horizontal">Horizontal</button>
            </div>
			<vv-virtual-scroll
                :items="items"
                :overscan="overscan"
                :horizontal="horizontal"
                :estimate-size="horizontal ? 144 : 51"
                :item-props="{ class: horizontal ? 'w-144 shrink-0 p-16 border-r border-surface-3' : 'p-16 border-b border-surface-3' }"
                class="h-256 overflow-auto border border-surface-3"
                :class="{ flex: horizontal }"
                data-testId="virtual-scroll"
            >
                <template #default="{ item }">
                    {{ item }}
                </template>
            </vv-virtual-scroll>
		`,
    }),
    play: changeOptionsTest,
}
