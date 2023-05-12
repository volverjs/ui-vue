import type { Meta, StoryObj } from '@storybook/vue3'
import VvButton from '@/components/VvButton/VvButton.vue'
import { Default } from './Button.stories'
import { argTypes, defaultArgs } from './Button.settings'

const meta: Meta<typeof VvButton> = {
	title: 'Components/Button/State',
	component: VvButton,
	args: defaultArgs,
	argTypes,
}

export default meta

type Story = StoryObj<typeof VvButton>

export const Active: Story = {
	...Default,
	args: {
		...Default.args,
		active: true,
		label: 'Active button',
	},
}

export const Pressed: Story = {
	...Default,
	args: {
		...Default.args,
		pressed: true,
		label: 'Pressed button',
	},
}

export const Disabled: Story = {
	...Default,
	args: {
		...Default.args,
		disabled: true,
		label: 'Disabled button',
	},
}
