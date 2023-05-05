import type { Meta, StoryObj } from '@storybook/vue3'
import VvButton from '@/components/VvButton/VvButton.vue'
import { Default } from './Button.stories'
import { argTypes, defaultArgs } from './Button.settings'

const meta: Meta<typeof VvButton> = {
	title: 'Components/Button/Loading',
	component: VvButton,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvButton>

export const Loading: Story = {
	...Default,
	args: {
		...Default.args,
		loading: true,
	},
}

export const Icon: Story = {
	...Default,
	args: {
		...Default.args,
		loadingIcon: 'reload',
		loading: true,
	},
}

export const Label: Story = {
	...Default,
	args: {
		...Default.args,
		loadingLabel: 'Reloading...',
		loading: true,
	},
}
