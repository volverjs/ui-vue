import type { Meta, StoryObj } from '@storybook/vue3'
import VvSelect from '@/components/VvSelect/VvSelect.vue'
import { Default } from './Select.stories'
import { defaultArgs, argTypes } from './Select.settings'

const meta: Meta<typeof VvSelect> = {
	title: 'Components/Select/Icon',
	component: VvSelect,
	args: defaultArgs,
	argTypes,
}

export default meta

type Story = StoryObj<typeof VvSelect>

export const DefaultIconPosition: Story = {
	...Default,
	args: {
		...Default.args,
		icon: 'heart',
	},
}

export const After: Story ={
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