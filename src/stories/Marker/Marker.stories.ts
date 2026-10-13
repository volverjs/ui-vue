import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvMarker from '@/components/VvMarker/VvMarker.vue'
import { argTypes, defaultArgs } from './Marker.settings'
import { defaultTest } from './Marker.test'

const meta: Meta<typeof VvMarker> = {
    title: 'Components/Marker',
    component: VvMarker,
    args: defaultArgs,
    argTypes,
    tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvMarker>

export const Default: Story = {
    args: {
        ...defaultArgs,
    },
    render: args => ({
        components: { VvMarker },
        setup() {
            return { args }
        },
        template: /* html */ `
			<vv-marker v-bind="args" data-testId="element">
				<template #default v-if="args.default"><span v-html="args.default"></span></template>
			</vv-marker>
		`,
    }),
    play: defaultTest,
}

/**
 * Framed in a pill, with an icon beside the text.
 */
export const Bordered: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        label: 'Search ran, 3 results',
        icon: 'search',
        modifiers: 'bordered',
    },
}

export const Slot: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        default: '<strong>Maria</strong> handed the conversation over',
    },
}
