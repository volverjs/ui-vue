import type { Meta, StoryObj } from '@storybook/vue3'
import VvDialog from '@/components/VvDialog/VvDialog.vue'
import { defaultArgs, argTypes } from './Dialog.settings'
import { Default } from './Dialog.stories'

const meta: Meta<typeof VvDialog> = {
	title: 'Components/Dialog/Slots',
	component: VvDialog,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvDialog>

export const DefaultSlot: Story = {
	...Default,
	args: {
		...defaultArgs,
		default: 'Default <em class="italic">slot!</em>',
	},
}

export const HeaderSlot: Story = {
	...Default,
	args: {
		...defaultArgs,
		header: 'Header <em class="italic">slot!</em>',
	},
}

export const FooterSlot: Story = {
	...Default,
	args: {
		...defaultArgs,
		footer: 'Footer <em class="italic">slot!</em>',
	},
}
