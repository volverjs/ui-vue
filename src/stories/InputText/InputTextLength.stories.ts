import type { Meta, StoryObj } from '@storybook/vue3'
import VvInputText from '@/components/VvInputText/VvInputText.vue'
import { Default } from './InputText.stories'
import { defaultArgs, argTypes } from './InputText.settings'

const meta: Meta<typeof VvInputText> = {
	title: 'Components/InputText/Length',
	component: VvInputText,
	args: defaultArgs,
	argTypes,
}

export default meta

type Story = StoryObj<typeof VvInputText>

export const MaxLength: Story = {
	...Default,
	args: {
		...Default.args,
		maxlength: 5,
	},
}

export const MinLength: Story = {
	...Default,
	args: {
		...Default.args,
		minlength: 5,
	},
}

export const Count: Story = {
	...Default,
	args: {
		...Default.args,
		count: true,
		minlength: 100,
	},
}

export const Limit: Story = {
	...Default,
	args: {
		...Default.args,
		count: 'limit',
		maxlength: 100,
	},
}

export const Countdown: Story = {
	...Default,
	args: {
		...Default.args,
		count: 'countdown',
		maxlength: 100,
	},
}
