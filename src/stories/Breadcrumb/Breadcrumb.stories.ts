import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvBreadcrumb from '@/components/VvBreadcrumb/VvBreadcrumb.vue'
import { argTypes, defaultArgs } from './Breadcrumb.settings'
import { defaultTest } from './Breadcrumb.test'

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
