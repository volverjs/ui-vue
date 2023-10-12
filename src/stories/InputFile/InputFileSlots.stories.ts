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
		'drop-area':
			'<div class="text-20 font-weight">Drop here your file</div>',
		modifiers: 'drop-area hidden square',
	},
}
