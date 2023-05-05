import type { Meta, StoryObj } from '@storybook/vue3'
import VvCombobox from '@/components/VvCombobox/VvCombobox.vue'
import { Default } from './Combobox.stories'
import { defaultArgs, argTypes } from './Combobox.settings'

const meta: Meta<typeof VvCombobox> = {
	title: 'Components/Combobox/Icon',
	component: VvCombobox,
	args: defaultArgs,
	argTypes,
}

export default meta

type Story = StoryObj<typeof VvCombobox>

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
