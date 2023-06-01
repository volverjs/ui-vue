import type { Meta, StoryObj } from '@storybook/vue3'
import VvCheckboxGroup from '@/components/VvCheckboxGroup/VvCheckboxGroup.vue'
import { defaultArgs, argTypes } from './CheckboxGroup.settings'
import { defaultTest } from './CheckboxGroup.test'

const meta: Meta<typeof VvCheckboxGroup> = {
	title: 'Components/CheckboxGroup',
	component: VvCheckboxGroup,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvCheckboxGroup>

export const Default: Story = {
	args: {
		...defaultArgs,
	},
	render: (args) => ({
		components: { VvCheckboxGroup },
		setup() {
			return { args }
		},
		data: () => ({ inputValue: undefined }),
		template: /* html */ `
			<vv-checkbox-group v-bind="args" v-model="inputValue" :data-testData="inputValue" data-testId="element">
				<template #default v-if="args.default"><span v-html="args.default"></span></template>
				<template #hint v-if="args.hint"><span v-html="args.hint"></span></template>
			</vv-checkbox-group>
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
		hint: 'Please fill the input above.',
	},
}
