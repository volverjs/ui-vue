import type { Meta, StoryObj } from '@storybook/vue3'
import VvCheckbox from '@/components/VvCheckbox/VvCheckbox.vue'
import { defaultArgs, argTypes } from './Checkbox.settings'
import { defaultTest } from './Checkbox.test'

const meta: Meta<typeof VvCheckbox> = {
	title: 'Components/Checkbox',
	component: VvCheckbox,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvCheckbox>

export const Default: Story = {
	args: {
		...defaultArgs,
	},
	render: (args) => ({
		components: { VvCheckbox },
		setup() {
			return { args }
		},
		data: () => ({ inputValue: args.uncheckedValue }),
		template: /* html */ `
			<vv-checkbox v-bind="args" v-model="inputValue" :data-testData="inputValue" data-testId="element">
				<template #default v-if="args.default"><span v-html="args.default"></span></template>
				<template #hint v-if="args.hint"><span v-html="args.hint"></span></template>
			</vv-checkbox>
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

export const Switch: Story = {
	...Default,
	args: {
		...defaultArgs,
		switch: true,
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

export const Indeterminate: Story = {
	...Default,
	args: {
		...defaultArgs,
		indeterminate: true,
	},
}

export const Hint: Story = {
	...Default,
	args: {
		...defaultArgs,
		hintLabel: 'Please accept terms and conditions',
	},
}
