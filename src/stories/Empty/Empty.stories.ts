import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvEmpty from '@/components/VvEmpty/VvEmpty.vue'
import { argTypes, defaultArgs } from './Empty.settings'
import { defaultTest } from './Empty.test'

const meta: Meta<typeof VvEmpty> = {
    title: 'Components/Empty',
    component: VvEmpty,
    args: defaultArgs,
    argTypes,
    tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvEmpty>

export const Default: Story = {
    args: {
        ...defaultArgs,
        default: '<button type="button" class="vv-button vv-button--primary">New message</button>',
    },
    render: args => ({
        components: { VvEmpty },
        setup() {
            return { args }
        },
        template: /* html */ `
			<vv-empty v-bind="args" data-testId="element">
				<template #media v-if="args.media"><span v-html="args.media"></span></template>
				<template #default v-if="args.default"><div v-html="args.default"></div></template>
			</vv-empty>
		`,
    }),
    play: defaultTest,
}

/**
 * Inside a list, a table or a card, where the frame is already there.
 */
export const Compact: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        title: 'No results',
        description: 'Try another search, or clear the filters.',
        icon: 'search',
        modifiers: 'compact',
    },
}

/**
 * An area waiting to be filled, such as a drop zone.
 */
export const Bordered: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        title: 'No documents',
        description: 'Drop a file here to add it to the knowledge base.',
        icon: 'upload',
        modifiers: 'bordered',
    },
}

/**
 * The empty state of a whole page, whose title is a heading.
 */
export const TitleTag: Story = {
    ...Default,
    args: {
        ...Default.args,
        titleTag: 'h2',
    },
}

export const MediaSlot: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        media: '<span aria-hidden="true">∅</span>',
    },
}
