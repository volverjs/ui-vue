import type { Meta, StoryObj } from '@storybook/vue3'
import VvAvatarGroup from '@/components/VvAvatarGroup/VvAvatarGroup.vue'
import { defaultArgs, argTypes } from './AvatarGroup.settings'
import { defaultTest } from './AvatarGroup.test'

const meta: Meta<typeof VvAvatarGroup> = {
	title: 'Components/AvatarGroup',
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
		components: { VvAvatarGroup },
		setup() {
			return { args }
		},
		template: /* html */ `
		<div class="m-md">
		<vv-avatar-group v-bind="args" data-testId="element">
			<template v-if="args.default">{{ args.default }}</template>
		</vv-avatar-group>
	</div>`,
	}),
	play: defaultTest,
}
