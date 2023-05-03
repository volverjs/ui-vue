import type { Meta, StoryObj } from '@storybook/vue3'
import VvTextarea from '@/components/VvTextarea/VvTextarea.vue'
import { Default } from './Textarea.stories'
import { defaultArgs, argTypes } from './Textarea.settings'

const meta: Meta<typeof VvTextarea> = {
	title: 'Components/Textarea/Length',
	component: VvTextarea,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvTextarea>

export const Maxlength: Story = {
	...Default,
	args: {
		...Default.args,
		maxlength: 5,
	},
}

export const Minlength: Story = {
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
		minLength: 100,
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
