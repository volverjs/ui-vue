import type { Meta, StoryObj } from '@storybook/vue3'
import VvInputFile from '@/components/VvInputFile/VvInputFile.vue'
import { Default as DefaultStory } from './InputFile.stories'
import { argTypes, defaultArgs } from './InputFile.settings'

const meta: Meta<typeof VvInputFile> = {
	title: 'Components/InputFile/Slots',
	component: VvInputFile,
	args: defaultArgs,
	argTypes,
}

export default meta

type Story = StoryObj<typeof VvInputFile>

export const DropArea: Story = {
	...DefaultStory,
	args: {
		...DefaultStory.args,
		class: 'max-w-320',
		'drop-area': 'Drag one or more files to this drop zone.',
		dropArea: true,
	},
}

export const Hint: Story = {
	...DefaultStory,
	args: {
		...DefaultStory.args,
		hint: 'Hint <em class="italic">slot!</em>',
	},
}
