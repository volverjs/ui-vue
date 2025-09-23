import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvAvatarGroup from '@/components/VvAvatarGroup/VvAvatarGroup.vue'
import { argTypes, defaultArgs } from './AvatarGroup.settings'
import { Default } from './AvatarGroup.stories'

const meta: Meta<typeof VvAvatarGroup> = {
    title: 'Components/AvatarGroup/Modifiers',
    component: VvAvatarGroup,
    args: defaultArgs,
    argTypes,
}

export default meta

type Story = StoryObj<typeof VvAvatarGroup>

export const Tight: Story = {
    ...Default,
    args: {
        ...Default.args,
        modifiers: 'tight',
    },
}

export const Relaxed: Story = {
    ...Default,
    args: {
        ...Default.args,
        modifiers: 'relaxed',
    },
}
