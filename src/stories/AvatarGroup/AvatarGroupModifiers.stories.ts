import type { Meta, StoryObj } from '@storybook/vue3'
import VvAvatarGroup from '@/components/VvAvatarGroup/VvAvatarGroup.vue'
import { defaultArgs, argTypes } from './AvatarGroup.settings'
import { Default } from './AvatarGroup.stories'

const meta: Meta<typeof VvAvatarGroup> = {
	title: 'Components/AvatarGroup/Modifiers',
	component: VvAvatarGroup,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
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
