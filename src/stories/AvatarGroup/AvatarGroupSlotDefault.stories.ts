import type { Meta, StoryObj } from '@storybook/vue3'
import VvAvatarGroup from '@/components/VvAvatarGroup/VvAvatarGroup.vue'
import VvAvatar from '@/components/VvAvatar/VvAvatar.vue'
import { defaultArgs, argTypes } from './AvatarGroup.settings'
import { defaultTest } from './AvatarGroup.test'

const meta: Meta<typeof VvAvatarGroup> = {
	title: 'Components/AvatarGroup/Slots',
	component: VvAvatarGroup,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvAvatarGroup>

export const Default: Story = {
	args: {
		...defaultArgs,
	},
	render: (args) => ({
		components: { VvAvatarGroup, VvAvatar },
		setup() {
			return { args }
		},

		template: /* html */ `
		<div class="m-md">
			<vv-avatar-group v-bind="args" data-testId="element" modifiers="relaxed">
				<vv-avatar modifiers="rounded">MR</vv-avatar>
				<vv-avatar modifiers="rounded accent">PB</vv-avatar>
				<vv-avatar imgSrc="https://i.pravatar.cc/300" modifiers="rounded" />
				<vv-avatar modifiers="rounded surface">+3</vv-avatar>
			</vv-avatar-group>
		</div>`,
	}),
	play: defaultTest,
}
