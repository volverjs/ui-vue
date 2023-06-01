import type { Meta, StoryObj } from '@storybook/vue3'
import VvIcon from '@/components/VvIcon/VvIcon.vue'
import { defaultArgs, argTypes } from './Icon.settings'
import NormalIcons from '@/assets/icons/normal.json'

const meta: Meta<typeof VvIcon> = {
	title: 'Components/Icon',
	component: VvIcon,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvIcon>

export const Default: Story = {
	args: {
		...defaultArgs,
	},
	render: (args) => ({
		components: { VvIcon },
		setup() {
			return { args }
		},
		template: /*html*/ `<vv-icon v-bind="args" />`,
	}),
}

export const Remote: Story = {
	...Default,
	args: {
		...defaultArgs,
		name: 'fingerprint',
		src: 'https://raw.githubusercontent.com/google/material-design-icons/master/src/action/fingerprint/materialicons/24px.svg',
	},
}

export const Inline: Story = {
	...Default,
	args: {
		...defaultArgs,
		name: 'bell-2',
		svg: `<svg viewBox="0 0 24 24">${NormalIcons.icons.bell.body}</svg>`,
	},
}

