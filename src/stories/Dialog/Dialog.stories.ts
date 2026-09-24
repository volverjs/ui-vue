import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvDialog from '@/components/VvDialog/VvDialog.vue'
import { argTypes, defaultArgs } from './Dialog.settings'
import { defaultTest, openOnMountTest } from './Dialog.test'

const meta: Meta<typeof VvDialog> = {
    title: 'Components/Dialog',
    component: VvDialog,
    args: defaultArgs,
    argTypes,
    tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvDialog>

export const Default: Story = {
    args: {
        ...defaultArgs,
    },
    render: args => ({
        components: { VvDialog },
        setup() {
            return { args }
        },
        data: () => ({ open: false }),
        methods: {
            onClick() {
                this.open = !this.open
            },
        },
        template: /* html */ `
			<vv-dialog v-bind="args" v-model="open" data-testId="element">
				<template #header v-if="args.header"><div v-html="args.header"></div></template>
				<template #default v-if="args.default"><div v-html="args.default"></div></template>
				<template #footer v-if="args.footer"><div v-html="args.footer"></div></template>
			</vv-dialog>
			<button class="vv-button" @click="onClick" data-testId="button">Toggle</button>
		`,
    }),
    play: defaultTest,
}

export const KeepOpen: Story = {
    ...Default,
    args: {
        ...defaultArgs,
        keepOpen: true,
    },
}

/**
 * A dialog whose model is already true when it mounts, as on a page that opens
 * one straight away.
 */
export const OpenOnMount: Story = {
    args: {
        ...defaultArgs,
    },
    render: args => ({
        components: { VvDialog },
        setup() {
            return { args }
        },
        data: () => ({ open: true, events: [] as string[] }),
        template: /* html */ `
			<vv-dialog
				v-bind="args"
				v-model="open"
				data-testId="element"
				@before-enter="events.push('beforeEnter')"
				@open="events.push('open')"
			>
				<div v-html="args.default"></div>
			</vv-dialog>
			<div>Events: <span data-testId="events">{{ events.join(' ') }}</span></div>
		`,
    }),
    play: openOnMountTest,
}
