import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvAvatar from '@/components/VvAvatar/VvAvatar.vue'
import { defaultTest } from '../Avatar/Avatar.test'
import { argTypes, defaultArgs } from './Avatar.settings'

const meta: Meta<typeof VvAvatar> = {
    title: 'Components/Avatar',
    component: VvAvatar,
    args: defaultArgs,
    argTypes,
    tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvAvatar>

export const Default: Story = {
    args: {
        ...defaultArgs,
        default: 'MR',
    },
    render: args => ({
        components: { VvAvatar },
        setup() {
            return { args }
        },
        template: /* html */ `
			<vv-avatar v-bind="args" data-testId="element">
				<template v-if="args.default"> {{ args.default }} </template>
			</vv-avatar>
    `,
    }),
    play: defaultTest,
}

export const Image: Story = {
    ...Default,
    args: {
        ...defaultArgs,
    },
}
