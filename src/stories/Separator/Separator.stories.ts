import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvSeparator from '@/components/VvSeparator/VvSeparator.vue'
import { argTypes, defaultArgs } from './Separator.settings'
import { defaultTest } from './Separator.test'

const meta: Meta<typeof VvSeparator> = {
    title: 'Components/Separator',
    component: VvSeparator,
    args: defaultArgs,
    argTypes,
    tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvSeparator>

export const Default: Story = {
    args: {
        ...defaultArgs,
    },
    render: args => ({
        components: { VvSeparator },
        setup() {
            return { args }
        },
        template: /* html */ `
			<vv-separator v-bind="args" data-testId="element">
				<template #default v-if="args.default"><span v-html="args.default"></span></template>
			</vv-separator>
		`,
    }),
    play: defaultTest,
}

export const Label: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        label: 'or',
    },
}

/**
 * A date between two days of messages, through the default slot.
 */
export const LabelSlot: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        default: '<time datetime="2026-10-13">Today</time>',
    },
}

/**
 * Between two items of a row, the line stands up and takes the height of
 * the row.
 */
export const Vertical: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        vertical: true,
    },
    render: args => ({
        components: { VvSeparator },
        setup() {
            return { args }
        },
        template: /* html */ `
			<div class="flex items-center gap-sm">
				<span>Day</span>
				<vv-separator v-bind="args" data-testId="element" />
				<span>Week</span>
			</div>
		`,
    }),
}
