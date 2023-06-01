import type { Meta, StoryObj } from '@storybook/vue3'
import VvDialog from '@/components/VvDialog/VvDialog.vue'
import { defaultTest } from './Dialog.test'
import { defaultArgs, argTypes } from './Dialog.settings'

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
	render: (args) => ({
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
		template: /*html*/ `
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
