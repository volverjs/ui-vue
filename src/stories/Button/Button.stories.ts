import type { Meta, StoryObj } from '@storybook/vue3'
import VvButton from '@/components/VvButton/VvButton.vue'
import { defaultTest } from './Button.test'
import { argTypes, defaultArgs } from './Button.settings'

const meta: Meta<typeof VvButton> = {
	title: 'Components/Button',
	component: VvButton,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvButton>

export const Default: Story = {
	args: {
		...defaultArgs,
	},
	render: (args) => ({
		components: { VvButton },
		setup() {
			return { args }
		},
		data: () => ({ currentValue: undefined }),
		template: /*html*/ `
			<vv-button v-bind="args" v-model="currentValue" name="my-button" data-testId="element">
				<template #before v-if="args.before"><div v-html="args.before"></div></template>
				<template #default v-if="args.default"><div v-html="args.default"></div></template>
				<template #after v-if="args.after"><div v-html="args.after"></div></template>
			</vv-button>
			<div v-if="args.toggle" class="mt-md">Value: {{ currentValue }}</div>
		`,
	}),
	play: defaultTest,
}