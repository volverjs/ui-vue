import type { Meta, StoryObj } from '@storybook/vue3'
import VvButtonGroup from '@/components/VvButtonGroup/VvButtonGroup.vue'
import { Default } from './ButtonGroup.stories'
import { defaultArgs, argTypes } from './ButtonGroup.settings'

const meta: Meta<typeof VvButtonGroup> = {
	title: 'Components/ButtonGroup/Modifiers',
	component: VvButtonGroup,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvButtonGroup>

export const Compact: Story = {
	...Default,
	args: {
		...Default.args,
		modifiers: 'compact',
	},
}

export const Vertical: Story = {
	...Default,
	args: {
		...Default.args,
		modifiers: 'vertical',
	},
}

export const Block: Story = {
	...Default,
	args: {
		...Default.args,
		modifiers: 'block',
	},
}
