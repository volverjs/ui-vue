import type { Meta, StoryObj } from '@storybook/vue3'
import VvNav from '@/components/VvNav/VvNav.vue'
import { defaultArgs, argTypes } from './Nav.settings'
import { defaultTest } from './Nav.test'

const meta: Meta<typeof VvNav> = {
	title: 'Components/Nav',
	component: VvNav,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvNav>

export const Default: Story = {
	args: {
		...defaultArgs,
	},
	render: (args) => ({
		components: { VvNav },
		setup() {
			return { args }
		},
		template: /* html */ `
			<div class="m-md w-1/2">
				<vv-nav v-bind="args" data-testId="element" />
			</div>`,
	}),
	play: defaultTest,
}