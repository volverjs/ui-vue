import type { Meta, StoryObj } from '@storybook/vue3'
import VvCombobox from '@/components/VvCombobox/VvCombobox.vue'
import { defaultArgs, argTypes } from './Combobox.settings'
import { Default } from './Combobox.stories'

const meta: Meta<typeof VvCombobox> = {
	title: 'Components/Combobox/Multiple',
	component: VvCombobox,
	args: defaultArgs,
	argTypes,
}

export default meta

type Story = StoryObj<typeof VvCombobox>

export const DefaultMultiple: Story = {
	...Default,
	args: {
		...Default.args,
		multiple: true,
	},
}

export const MaxValues: Story = {
	...Default,
	args: {
		...Default.args,
		multiple: true,
		maxValues: 2,
	},
}

export const Separator: Story = {
	...Default,
	args: {
		...Default.args,
		multiple: true,
		separator: ' | ',
	},
}
