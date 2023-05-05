import type { Meta, StoryObj } from '@storybook/vue3'
import VvCheckbox from '@/components/VvCheckbox/VvCheckbox.vue'
import { defaultArgs, argTypes } from './Checkbox.settings'
import { Default } from './Checkbox.stories'

const meta: Meta<typeof VvCheckbox> = {
	title: 'Components/Checkbox/Binary',
	component: VvCheckbox,
	args: defaultArgs,
	argTypes,
}

export default meta

type Story = StoryObj<typeof VvCheckbox>

export const TrueFalse: Story = {
	...Default,
	args: {
		...defaultArgs,
		value: true,
		uncheckedValue: false,
	},
}

export const YesNo: Story = {
	...Default,
	args: {
		...defaultArgs,
		value: 'Yes',
		uncheckedValue: 'No',
	},
}