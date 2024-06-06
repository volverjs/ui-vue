import type { Meta, StoryObj } from '@storybook/vue3'
import { defaultArgs, argTypes } from './Badge.settings'
import { Default as DefaultStory } from './Badge.stories'
import VvBadge from '@/components/VvBadge/VvBadge.vue'

const meta: Meta<typeof VvBadge> = {
    title: 'Components/Badge/Slots',
    component: VvBadge,
    args: defaultArgs,
    argTypes,
}

export default meta

type Story = StoryObj<typeof VvBadge>

export const Default: Story = {
    ...DefaultStory,
    args: {
        ...DefaultStory.args,
        default: 'Default <em class="italic">slot!</em>',
    },
}
