import type { Meta, StoryObj } from '@storybook/vue3'
import VvInputText from '@/components/VvInputText/VvInputText.vue'
import { Default } from './InputText.stories'
import { defaultArgs, argTypes } from './InputText.settings'

const meta: Meta<typeof VvInputText> = {
	title: 'Components/InputText/Icon',
	component: VvInputText,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvInputText>

export const DefaultPosition: Story = {
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
