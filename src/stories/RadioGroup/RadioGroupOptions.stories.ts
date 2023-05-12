import type { Meta, StoryObj } from '@storybook/vue3'
import VvRadioGroup from '@/components/VvRadioGroup/VvRadioGroup.vue'
import { Default } from './RadioGroup.stories'
import { defaultArgs, argTypes } from './RadioGroup.settings'

const meta: Meta<typeof VvRadioGroup> = {
	title: 'Components/RadioGroup/Options',
	component: VvRadioGroup,
	args: defaultArgs,
	argTypes,
}

export default meta

type Story = StoryObj<typeof VvRadioGroup>

export const ArrayOfObjects: Story = {
	...Default,
	args: {
		...Default.args,
		options: [
			{ value: 'first', label: 'First' },
			{ value: 'second', label: 'Second' },
			{ value: 'third', label: 'Third' },
		],
	},
}

export const OptionLabelKey: Story = {
	...Default,
	args: {
		...Default.args,
		labelKey: 'name',
		options: [
			{ value: 'first', name: 'First' },
			{ value: 'second', name: 'Second' },
			{ value: 'third', name: 'Third' },
		],
	},
}

export const OptionValueKey: Story = {
	...Default,
	args: {
		...Default.args,
		valueKey: 'id',
		options: [
			{ id: 'first', label: 'First' },
			{ id: 'second', label: 'Second' },
			{ id: 'third', label: 'Third' },
		],
	},
}