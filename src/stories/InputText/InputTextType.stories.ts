import type { Meta, StoryObj } from '@storybook/vue3'
import VvInputText from '@/components/VvInputText/VvInputText.vue'
import { Default } from './InputText.stories'
import { defaultArgs, argTypes } from './InputText.settings'

const meta: Meta<typeof VvInputText> = {
	title: 'Components/InputText/Type',
	component: VvInputText,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvInputText>

export const Text: Story = {
	...Default,
	args: {
		...Default.args,
		type: 'text',
	},
}

export const Password: Story = {
	...Default,
	args: {
		...Default.args,
		type: 'password',
	},
}

export const Date: Story = {
	...Default,
	args: {
		...Default.args,
		type: 'date',
	},
}

export const DateTime: Story = {
	...Default,
	args: {
		...Default.args,
		type: 'datetime-local',
	},
}

export const Time: Story = {
	...Default,
	args: {
		...Default.args,
		type: 'time',
	},
}

export const Month: Story = {
	...Default,
	args: {
		...Default.args,
		type: 'month',
	},
}

export const Week: Story = {
	...Default,
	args: {
		...Default.args,
		type: 'week',
	},
}

export const Number: Story = {
	...Default,
	args: {
		...Default.args,
		type: 'number',
	},
}

export const Email: Story = {
	...Default,
	args: {
		...Default.args,
		type: 'email',
	},
}

export const Tel: Story = {
	...Default,
	args: {
		...Default.args,
		type: 'tel',
	},
}

export const Url: Story = {
	...Default,
	args: {
		...Default.args,
		type: 'url',
	},
}

export const Color: Story = {
	...Default,
	args: {
		...Default.args,
		type: 'color',
	},
}

export const Search: Story = {
	...Default,
	args: {
		...Default.args,
		type: 'search',
	},
}
