import type { Meta, StoryObj } from '@storybook/vue3'
import VvInputText from '@/components/VvInputText/VvInputText.vue'
import { Default } from './InputText.stories'
import { defaultArgs, argTypes } from './InputText.settings'

const meta: Meta<typeof VvInputText> = {
	title: 'Components/InputText/MinMax',
	component: VvInputText,
	args: defaultArgs,
	argTypes,
}

export default meta

type Story = StoryObj<typeof VvInputText>

export const MinNumber: Story = {
	...Default,
	args: {
		...Default.args,
		type: 'number',
		min: -15,
	},
}

export const MaxNumber: Story = {
	...Default,
	args: {
		...Default.args,
		type: 'number',
		max: 15,
	},
}

export const MinDate: Story = {
	...Default,
	args: {
		...Default.args,
		type: 'date',
		min: new Date().toISOString().split('T')[0],
	},
}

export const MaxDate: Story = {
	...Default,
	args: {
		...Default.args,
		type: 'date',
		max: new Date().toISOString().split('T')[0],
	},
}