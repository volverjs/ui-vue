import type { Meta, StoryObj } from '@storybook/vue3'
import VvRadio from '@/components/VvRadio/VvRadio.vue'
import { defaultArgs, argTypes } from './Radio.settings'
import { defaultTest } from './Radio.test'

const meta: Meta<typeof VvRadio> = {
	title: 'Components/Radio',
	component: VvRadio,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvRadio>

export const Default: Story = {
	args: {
		...defaultArgs,
	},
	render: (args) => ({
		components: { VvRadio },
		setup() {
			return { args }
		},
		data: () => ({ inputValue: undefined }),
		template: /* html */ `
			<vv-radio v-bind="args" v-model="inputValue" :data-testData="inputValue" data-testId="element">
				<template #default v-if="args.default"><span v-html="args.default"></span></template>
				<template #hint v-if="args.hint"><span v-html="args.hint"></span></template>
			</vv-radio>
			<div>Value: <span data-testId="value">{{inputValue}}</span></div> 
		`,
	}),
	play: defaultTest,
}

export const Disabled: Story = {
	...Default,
	args: {
		...defaultArgs,
		disabled: true,
	},
}

export const Readonly: Story = {
	...Default,
	args: {
		...defaultArgs,
		readonly: true,
	},
}

export const Invalid: Story = {
	...Default,
	args: {
		...defaultArgs,
		invalid: true,
		invalidLabel: 'You must accept terms and conditions',
		label: 'Accept terms and conditions',
	},
}

export const Valid: Story = {
	...Default,
	args: {
		...defaultArgs,
		valid: true,
		validLabel: 'Thank you for accepting terms and conditions',
		label: 'Accept terms and conditions',
	},
}

export const Hint: Story = {
	...Default,
	args: {
		...defaultArgs,
		hintLabel: 'Please accept terms and conditions',
	},
}
