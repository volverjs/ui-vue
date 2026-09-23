import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvAvatarGroup from '@/components/VvAvatarGroup/VvAvatarGroup.vue'
import VvButton from '@/components/VvButton/VvButton.vue'
import { argTypes, defaultArgs } from './AvatarGroup.settings'
import { defaultTest, stableKeysTest } from './AvatarGroup.test'

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
    render: args => ({
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

export const StableKeys: Story = {
    args: {
        ...defaultArgs,
    },
    render: args => ({
        components: { VvAvatarGroup, VvButton },
        setup() {
            const avatarModifiers = ref('rounded')
            return { args, avatarModifiers }
        },
        template: /* html */ `
		<div class="m-md">
			<vv-avatar-group v-bind="args" :avatar-modifiers="avatarModifiers" data-testId="element" />
			<vv-button data-testId="square" class="mt-24" label="Square avatars" modifiers="secondary" :disabled="avatarModifiers === 'square'" @click="avatarModifiers = 'square'" />
		</div>`,
    }),
    play: stableKeysTest,
}
