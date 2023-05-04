import type { Meta, StoryObj } from '@storybook/vue3'
import VvNav from '@/components/VvNav/VvNav.vue'
import { defaultArgs, argTypes } from './Nav.settings'
import { Default } from './Nav.stories'

const meta: Meta<typeof VvNav> = {
	title: 'Components/Nav/Modifiers',
	component: VvNav,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvNav>

export const Sidebar: Story = {
	...Default,
	args: {
		...Default.args,
		modifiers: 'sidebar',
	},
}

export const Aside: Story = {
	...Default,
	args: {
		...Default.args,
		modifiers: 'aside',
	},
}

export const Tabs: Story = {
	...Default,
	args: {
		...Default.args,
		modifiers: 'tabs',
	},
}

export const TabsFull: Story = {
	...Default,
	args: {
		...Default.args,
		modifiers: 'tabs full',
	},
}
