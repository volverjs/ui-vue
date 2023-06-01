import type { Meta, StoryObj } from '@storybook/vue3'
import VvDialog from '@/components/VvDialog/VvDialog.vue'
import { defaultArgs, argTypes } from './Dialog.settings'
import { Default as DefaultStory } from './Dialog.stories'

const meta: Meta<typeof VvDialog> = {
	title: 'Components/Dialog/Slots',
	component: VvDialog,
	args: defaultArgs,
	argTypes,
}

export default meta

type Story = StoryObj<typeof VvDialog>

export const Default: Story = {
	...DefaultStory,
	args: {
		...defaultArgs,
		default: 'DefaultStory <em class="italic">slot!</em>',
	},
}

export const HeaderSlot: Story = {
	...DefaultStory,
	args: {
		...defaultArgs,
		header: 'Header <em class="italic">slot!</em>',
	},
}

export const FooterSlot: Story = {
	...DefaultStory,
	args: {
		...defaultArgs,
		footer: 'Footer <em class="italic">slot!</em>',
	},
}
