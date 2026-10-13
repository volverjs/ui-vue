import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvKbd from '@/components/VvKbd/VvKbd.vue'
import { argTypes, defaultArgs } from './Kbd.settings'
import { defaultTest } from './Kbd.test'

const meta: Meta<typeof VvKbd> = {
    title: 'Components/Kbd',
    component: VvKbd,
    args: defaultArgs,
    argTypes,
    tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvKbd>

export const Default: Story = {
    args: {
        ...defaultArgs,
    },
    render: args => ({
        components: { VvKbd },
        setup() {
            return { args }
        },
        template: /* html */ `
			<p>
				Press
				<vv-kbd v-bind="args" data-testId="element">
					<template #default v-if="args.default">{{ args.default }}</template>
				</vv-kbd>
				to go on.
			</p>
		`,
    }),
    play: defaultTest,
}

export const Combination: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        keys: ['Ctrl', 'K'],
    },
}

/**
 * A combination written with no separator, as on a Mac.
 */
export const NoSeparator: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        keys: ['⌘', 'S'],
        separator: '',
    },
}

export const Slot: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        keys: undefined,
        default: 'Enter',
    },
}
