import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvVirtualScroll from '@/components/VvVirtualScroll/VvVirtualScroll.vue'
import { argTypes, defaultArgs } from './VirtualScroll.settings'
import { defaultTest } from './VirtualScroll.test'

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
        startSpacerProps: { class: 'shrink-0' },
        endSpacerProps: { class: 'shrink-0' },
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
    play: defaultTest,
}
