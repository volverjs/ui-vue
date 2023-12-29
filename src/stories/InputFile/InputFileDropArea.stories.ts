import type { Meta, StoryObj } from '@storybook/vue3'
import VvInputFile from '@/components/VvInputFile/VvInputFile.vue'
import { Default as DefaultStory } from './InputFile.stories'
import { argTypes, defaultArgs } from './InputFile.settings'

const meta: Meta<typeof VvInputFile> = {
	title: 'Components/InputFile/DropArea',
	component: VvInputFile,
	args: defaultArgs,
	argTypes,
}

export default meta

type Story = StoryObj<typeof VvInputFile>

export const Default: Story = {
	...DefaultStory,
	args: {
		...DefaultStory.args,
		label: 'Drop area',
		dropArea: true,
	},
}

export const InputHidden: Story = {
	...Default,
	args: {
		...Default.args,
		label: 'Drop area hidden input',
		dropArea: true,
		modifiers: 'hidden',
	},
}

export const Square: Story = {
	...Default,
	args: {
		...Default.args,
		class: 'max-w-192',
		label: 'Drop area square',
		dropArea: true,
		modifiers: 'square hidden',
	},
}

export const Circle: Story = {
	...Default,
	args: {
		...Default.args,
		class: 'max-w-192',
		label: 'Drop area circle',
		dropArea: true,
		modifiers: 'circle hidden',
	},
}
