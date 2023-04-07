// Replace vue3 with vue if you are using Storybook for Vue 2
import type { Meta, StoryObj } from '@storybook/vue3'
import VvAvatar from '@/components/VvAvatar/VvAvatar.vue'
import VvBadge from '@/components/VvBadge/VvBadge.vue'
import { defaultArgs, argTypes } from './Avatar.settings'

const meta: Meta<typeof VvAvatar> = {
	title: 'Components/AvatarTs/Badge',
	component: VvAvatar,
	args: defaultArgs,
	argTypes,
}

export default meta

type Story = StoryObj<typeof VvAvatar>

export const Badge: Story = {
	args: {
		modifiers: 'lg',
	},
	render: (args) => ({
		components: { VvAvatar, VvBadge },
		setup() {
			return { args }
		},
		template: /* html */ `
			<vv-avatar v-bind="args" data-testId="element">
				MR
                <sup>
                    <vv-badge modifiers="danger rounded">99+</vv-badge>
                </sup>
			</vv-avatar>
    `,
	}),
}
