import type { Meta, StoryObj } from '@storybook/vue3'
import VvProgress from '@/components/VvProgress/VvProgress.vue'
import { argTypes, defaultArgs } from './Progress.settings'
import { defaultTest } from './Progress.test'

const meta: Meta<typeof VvProgress> = {
    title: 'Components/Progress',
    component: VvProgress,
    args: defaultArgs,
    argTypes,
    tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvProgress>

export const Default: Story = {
    args: {
        ...defaultArgs,
    },
    render: args => ({
        components: { VvProgress },
        setup() {
            return { args }
        },
        template: /* html */ `
			<vv-progress v-bind="args" />
		`,
    }),
    play: defaultTest,
}

export const Determinate: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        max: '100',
        value: '25',
    },
}
