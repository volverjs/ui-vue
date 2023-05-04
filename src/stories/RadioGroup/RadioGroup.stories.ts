import type { Meta, StoryObj } from '@storybook/vue3'
import VvRadioGroup from '@/components/VvRadioGroup/VvRadioGroup.vue'
import { defaultArgs, argTypes } from './RadioGroup.settings'
import { defaultTest } from './RadioGroup.test'

const meta: Meta<typeof VvRadioGroup> = {
	title: 'Components/RadioGroup',
	component: VvRadioGroup,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvRadioGroup>

export const Default: Story = {
	args: {
		...defaultArgs,
	},
	render: (args) => ({
		components: { VvRadioGroup },
		setup() {
			return { args }
		},
		data: () => ({ inputValue: undefined }),
		template: /* html */ `
			<vv-radio-group v-bind="args" v-model="inputValue" :data-testData="inputValue" data-testId="element">
				<template #default v-if="args.default"><span v-html="args.default"></span></template>
				<template #hint v-if="args.hint"><span v-html="args.hint"></span></template>
			</vv-radio-group>
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

export const Vertical: Story = {
	...Default,
	args: {
		...defaultArgs,
		vertical: true,
	},
}

export const Invalid: Story = {
	...Default,
	args: {
		...defaultArgs,
		invalid: true,
		invalidLabel: 'This field is required.',
	},
}


export const Valid: Story = {
	...Default,
	args: {
		...defaultArgs,
		valid: true,
		validLabel: 'Selected response is valid.',
	},
}

export const Hint: Story = {
	...Default,
	args: {
		...defaultArgs,
		hintLabel: 'Please fill the input above.',
	},
}