import type { Meta, StoryObj } from '@storybook/vue3'
import VvSelect from '@/components/VvSelect/VvSelect.vue'
import { Default } from './Select.stories'
import { defaultArgs, argTypes } from './Select.settings'

const meta: Meta<typeof VvSelect> = {
	title: 'Components/Select/Options',
	component: VvSelect,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvSelect>

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

export const GroupedOptions: Story = {
	...Default,
	args: {
		...Default.args,
		options: [
			{
				label: 'Group 1',
				options: [
					{ value: 'first', label: 'First' },
					{ value: 'second', label: 'Second' },
				],
			},
			{
				label: 'Group 2',
				options: [
					{ value: 'third', label: 'Third' },
					{ value: 'fourth', label: 'Fourth' },
				],
			},
		],
	},
}
