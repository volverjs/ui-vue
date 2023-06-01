import type { Meta, StoryObj } from '@storybook/vue3'
import VvCheckboxGroup from '@/components/VvCheckboxGroup/VvCheckboxGroup.vue'
import { Default } from './CheckboxGroup.stories'
import { defaultArgs, argTypes } from './CheckboxGroup.settings'

const meta: Meta<typeof VvCheckboxGroup> = {
	title: 'Components/CheckboxGroup/Options',
	component: VvCheckboxGroup,
	args: defaultArgs,
	argTypes,
}

export default meta

type Story = StoryObj<typeof VvCheckboxGroup>

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
