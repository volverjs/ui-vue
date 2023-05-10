import type { Meta, StoryObj } from '@storybook/vue3'
import VvAlert from '@/components/VvAlert/VvAlert.vue'
// import { defaultTest } from './Alert.test'
import { defaultArgs, argTypes } from './Alert.settings'

const meta: Meta<typeof VvAlert> = {
	title: 'Components/Alert',
	component: VvAlert,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
}

export default meta

export type Story = StoryObj<typeof VvAlert>

export const Default: Story = {
	args: defaultArgs,
	// play: defaultTest,
	render: (args) => ({
		components: { VvAlert },
		setup() {
			return { args }
		},
		template: /* html */ `
			<vv-alert v-bind="args" data-testId="element">
				<template #header v-if="args.header"><div v-html="args.header"></div></template>
				<template #title::before v-if="args['title::before']"><div v-html="args['title::before']"></div></template>
				<template #title::after v-if="args['title::after']"><div v-html="args['title::after']"></div></template>
				<template #default v-if="args.default"><div v-html="args.default"></div></template>
				<template #footer v-if="args.footer"><div v-html="args.footer"></div></template>
			</vv-alert>
        `,
	}),
}

export const Dismissable: Story = {
	...Default,
	args: {
		...defaultArgs,
		dismissable: true,
	},
}

export const AutoClose: Story = {
	...Default,
	args: {
		...defaultArgs,
		autoClose: 8000,
	},
}

export const Icon: Story = {
	...Default,
	args: {
		...defaultArgs,
		icon: 'warning',
	},
}
