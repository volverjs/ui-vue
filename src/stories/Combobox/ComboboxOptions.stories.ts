import type { Meta, StoryObj } from '@storybook/vue3'
import VvCombobox from '@/components/VvCombobox/VvCombobox.vue'
import { Default } from './Combobox.stories'
import { defaultArgs, argTypes } from './Combobox.settings'

const meta: Meta<typeof VvCombobox> = {
	title: 'Components/Combobox/Options',
	component: VvCombobox,
	args: defaultArgs,
	argTypes,
}

export default meta

type Story = StoryObj<typeof VvCombobox>

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

export const DotPathOptions: Story = {
	...Default,
	args: {
		...Default.args,
		valueKey: 'value.val',
		labelKey: 'label.en',
		options: [
			{ value: { val: 'first' }, label: { it: 'Primo', en: 'First' } },
			{
				value: { val: 'second' },
				label: { it: 'Secondo', en: 'Second' },
			},
			{ value: { val: 'third' }, label: { it: 'Terzo', en: 'Third' } },
			{ value: { val: 'fourth' }, label: { it: 'Quarto', en: 'Fourth' } },
		],
	},
}

export const ObjectValue: Story = {
	...Default,
	args: {
		...Default.args,
		multiple: true,
		options: [
			{
				value: { name: 'John Doe', email: 'john.doe@test.com' },
				label: 'John Doe',
			},
			{
				value: { name: 'Jane Doe', email: 'jane.doe@test.com' },
				label: 'Jane Doe',
			},
		],
	},
}
