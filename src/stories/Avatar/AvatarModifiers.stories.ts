import type { Meta, StoryObj } from '@storybook/vue3'
import VvAvatar from '@/components/VvAvatar/VvAvatar.vue'
import { defaultArgs, argTypes } from './Avatar.settings'
import { defaultTest } from '../Avatar/Avatar.test'

const meta: Meta<typeof VvAvatar> = {
	title: 'Components/Avatar/Modifiers',
	component: VvAvatar,
	args: defaultArgs,
	argTypes,
}

export default meta

type Story = StoryObj<typeof VvAvatar>

const VvAvatarTemplate: Story = {
	args: {
		default: 'MR',
		modifiers: '',
	},
	render: (args) => ({
		components: { VvAvatar },
		setup() {
			return { args }
		},
		template: /* html */ `
			<vv-avatar v-bind="args" data-testId="element">
				{{ args.default }}
			</vv-avatar>`,
	}),
	play: defaultTest,
}

export const Small: Story = {
	...VvAvatarTemplate,
}

export const Medium: Story = {
	...VvAvatarTemplate,
	args: {
		...VvAvatarTemplate.args,
		modifiers: 'md',
	},
}

export const Large: Story = {
	...VvAvatarTemplate,
	args: {
		...VvAvatarTemplate.args,
		modifiers: 'lg',
	},
}

export const Rounded: Story = {
	...VvAvatarTemplate,
	args: {
		...VvAvatarTemplate.args,
		modifiers: 'rounded md',
	},
}

export const Square: Story = {
	...VvAvatarTemplate,
	args: {
		...VvAvatarTemplate.args,
		modifiers: 'square md',
	},
}

export const Bordered: Story = {
	...VvAvatarTemplate,
	args: {
		...VvAvatarTemplate.args,
		modifiers: 'bordered md',
	},
}

export const Ring: Story = {
	...VvAvatarTemplate,
	args: {
		...VvAvatarTemplate.args,
		modifiers: 'ring md',
	},
}

export const CustomColor: Story = {
	...VvAvatarTemplate,
	args: {
		...VvAvatarTemplate.args,
		modifiers: 'accent md',
	},
	argTypes: {
		...argTypes,
		modifiers: {
			...argTypes.modifiers,
			options: [...argTypes.modifiers.options, 'accent'],
		},
	},
}
