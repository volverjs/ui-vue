import type { Meta, StoryObj } from '@storybook/vue3'
import VvTextarea from '@/components/VvTextarea/VvTextarea.vue'
import { Default } from './Textarea.stories'
import { defaultArgs, argTypes } from './Textarea.settings'

const meta: Meta<typeof VvTextarea> = {
	title: 'Components/Textarea/Icon',
	component: VvTextarea,
	args: defaultArgs,
	argTypes,
}

export default meta

type Story = StoryObj<typeof VvTextarea>

export const DefaultIconPosition: Story = {
	...Default,
	args: {
		...Default.args,
		icon: 'heart',
	},
}

export const After: Story = {
	...Default,
	args: {
		...Default.args,
		icon: 'heart',
		iconPosition: 'after',
	},
}

export const Src: Story = {
	...Default,
	args: {
		...Default.args,
		icon: {
			name: 'engineering',
			src: 'https://raw.githubusercontent.com/google/material-design-icons/master/src/social/engineering/materialicons/24px.svg',
		},
	},
}
