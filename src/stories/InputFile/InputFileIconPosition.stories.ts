import type { Meta, StoryObj } from '@storybook/vue3'
import VvInputFile from '@/components/VvInputFile/VvInputFile.vue'
import { Default } from './InputFile.stories'
import { defaultArgs, argTypes } from './InputFile.settings'

const meta: Meta<typeof VvInputFile> = {
	title: 'Components/InputFile/Icon',
	component: VvInputFile,
	args: defaultArgs,
	argTypes,
}

export default meta

type Story = StoryObj<typeof VvInputFile>

export const DefaultPosition: Story = {
	...Default,
	args: {
		...Default.args,
		icon: 'heart',
	},
}

export const After: Story = {
	...Default,
	args: {
		...Default.args,
		icon: 'heart',
		iconPosition: 'after',
	},
}

export const Src: Story = {
	...Default,
	args: {
		...Default.args,
		icon: {
			name: 'engineering',
			src: 'https://raw.githubusercontent.com/google/material-design-icons/master/src/social/engineering/materialicons/24px.svg',
		},
	},
}
