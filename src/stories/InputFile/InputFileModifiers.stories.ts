import type { Meta, StoryObj } from '@storybook/vue3'
import VvInputFile from '@/components/VvInputFile/VvInputFile.vue'
import { Default } from './InputFile.stories'
import { argTypes, defaultArgs } from './InputFile.settings'

const meta: Meta<typeof VvInputFile> = {
	title: 'Components/InputFile/Modifiers',
	component: VvInputFile,
	args: defaultArgs,
	argTypes,
}

export default meta

type Story = StoryObj<typeof VvInputFile>

export const DropArea: Story = {
	...Default,
	args: {
		...Default.args,
		label: 'Drop area',
		modifiers: 'drop-area',
	},
}

export const DropAreaHidden: Story = {
	...Default,
	args: {
		...Default.args,
		label: 'Drop area hidden',
		modifiers: 'drop-area hidden',
	},
}

export const DropAreaSquare: Story = {
	...Default,
	args: {
		...Default.args,
		label: 'Drop area square',
		modifiers: 'drop-area square hidden',
	},
}

export const DropAreaCircle: Story = {
	...Default,
	args: {
		...Default.args,
		label: 'Drop area circle',
		modifiers: 'drop-area circle hidden',
	},
}
