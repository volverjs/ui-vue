import type { Meta } from '@storybook/vue3'
import VvAlert from '@/components/VvAlert/VvAlert.vue'
import { defaultArgs, argTypes } from './Alert.settings'
import { Default, type Story } from './Alert.stories'

const meta: Meta<typeof VvAlert> = {
	title: 'Components/Alert/Modifiers',
	component: VvAlert,
	args: defaultArgs,
	argTypes,
}

export default meta

export const Notification: Story = {
	...Default,
	args: {
		...defaultArgs,
		modifiers: ['notification'],
	},
}

export const Callout: Story = {
	...Default,
	args: {
		...defaultArgs,
		modifiers: ['callout'],
	},
}

export const Info: Story = {
	...Default,
	args: {
		...defaultArgs,
		modifiers: ['info'],
	},
}

export const Success: Story = {
	...Default,
	args: {
		...defaultArgs,
		modifiers: ['success'],
	},
}

export const Warning: Story = {
	...Default,
	args: {
		...defaultArgs,
		modifiers: ['warning'],
	},
}

export const Danger: Story = {
	...Default,
	args: {
		...defaultArgs,
		modifiers: ['danger'],
	},
}

export const Accent: Story = {
	...Default,
	args: {
		...defaultArgs,
		modifiers: ['accent'],
	},
}

export const Brand: Story = {
	...Default,
	args: {
		...defaultArgs,
		modifiers: ['brand'],
	},
}
