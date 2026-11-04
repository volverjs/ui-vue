import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvBreadcrumb from '@/components/VvBreadcrumb/VvBreadcrumb.vue'
import { argTypes, defaultArgs } from './Breadcrumb.settings'
import { defaultTest, wheelTest } from './Breadcrumb.test'

const meta: Meta<typeof VvBreadcrumb> = {
    title: 'Components/Breadcrumb',
    component: VvBreadcrumb,
    args: defaultArgs,
    argTypes,
    tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvBreadcrumb>

export const Default: Story = {
    args: {
        ...defaultArgs,
    },
    render: args => ({
        components: { VvBreadcrumb },
        setup() {
            return { args }
        },
        template: /* html */ `
			<div class="bg-surface p-lg">
			<vv-breadcrumb v-bind="args" />
		</div>`,
    }),
    play: data => defaultTest(data, false),
}

export const Multiline: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        modifiers: 'multiline',
    },
}

/**
 * A path wider than its box, scrolled with a mouse wheel. The list scrolls
 * only sideways and hides its scrollbar, and a wheel turns on the vertical
 * axis: a vertical turn over the list scrolls it sideways.
 */
export const Wheel: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        routes: [
            { label: 'Home', href: '/home' },
            { label: 'Library', href: '/library' },
            { label: 'Novels', href: '/library/novels' },
            { label: 'Classics', href: '/library/novels/classics' },
            { label: 'Book 1' },
        ],
    },
    render: args => ({
        components: { VvBreadcrumb },
        setup() {
            return { args }
        },
        template: /* html */ `
			<div class="bg-surface p-lg" style="width: 200px">
				<vv-breadcrumb v-bind="args" data-testId="element" />
			</div>`,
    }),
    play: wheelTest,
}
