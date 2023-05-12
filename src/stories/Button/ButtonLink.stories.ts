import type { Meta, StoryObj } from '@storybook/vue3'
import VvButton from '@/components/VvButton/VvButton.vue'
import { Default } from './Button.stories'
import { argTypes, defaultArgs } from './Button.settings'

const meta: Meta<typeof VvButton> = {
	title: 'Components/Button/Link',
	component: VvButton,
	args: defaultArgs,
	argTypes,
}

export default meta

type Story = StoryObj<typeof VvButton>

export const Href: Story = {
	...Default,
	args: {
		...Default.args,
		icon: 'arrow-right',
		iconPosition: 'right',
		label: 'Link button',
		href: 'https://volverjs.github.io/style',
		target: '_blank',
	},
}

export const HrefDisabled: Story = {
	...Default,
	args: {
		...Default.args,
		icon: 'arrow-right',
		iconPosition: 'right',
		label: 'Link button',
		href: 'https://volverjs.github.io/style',
		target: '_blank',
		disabled: true,
	},
}
