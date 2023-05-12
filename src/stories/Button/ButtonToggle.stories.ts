import type { Meta, StoryObj } from '@storybook/vue3'
import VvButton from '@/components/VvButton/VvButton.vue'
import { Default } from './Button.stories'
import { argTypes, defaultArgs } from './Button.settings'

const meta: Meta<typeof VvButton> = {
	title: 'Components/Button/Toggle',
	component: VvButton,
	args: defaultArgs,
	argTypes,
}

export default meta

type Story = StoryObj<typeof VvButton>

export const Toggle: Story = {
	...Default,
	args: {
		...Default.args,
		toggle: true,
	},
}

export const TrueFalse: Story = {
	...Default,
	args: {
		...Default.args,
		toggle: true,
		value: true,
		uncheckedValue: false,
	},
}

export const YesNo: Story = {
	...Default,
	args: {
		...Default.args,
		toggle: true,
		value: 'yes',
		uncheckedValue: 'no',
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
