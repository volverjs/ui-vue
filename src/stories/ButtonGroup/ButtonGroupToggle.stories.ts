import type { Meta, StoryObj } from '@storybook/vue3'
import VvButtonGroup from '@/components/VvButtonGroup/VvButtonGroup.vue'
import { Default } from './ButtonGroup.stories'
import { defaultArgs, argTypes } from './ButtonGroup.settings'

const meta: Meta<typeof VvButtonGroup> = {
	title: 'Components/ButtonGroup/Toggle',
	component: VvButtonGroup,
	args: defaultArgs,
	argTypes,
}

export default meta

type Story = StoryObj<typeof VvButtonGroup>

export const Toggle: Story = {
	...Default,
	args: {
		...Default.args,
		toggle: true,
	},
}

export const Multiple: Story = {
	...Default,
	args: {
		...Default.args,
		toggle: true,
		multiple: true,
	},
}

export const Unselectable: Story = {
	...Default,
	args: {
		...Default.args,
		toggle: true,
		unselectable: true,
	},
}
