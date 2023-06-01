import type { Meta, StoryObj } from '@storybook/vue3'
import VvTextarea from '@/components/VvTextarea/VvTextarea.vue'
import { defaultArgs, argTypes } from './Textarea.settings'
import { defaultTest } from './Textarea.test'

const meta: Meta<typeof VvTextarea> = {
	title: 'Components/Textarea',
	component: VvTextarea,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvTextarea>

export const Default: Story = {
	args: {
		...defaultArgs,
	},
	render: (args) => ({
		components: { VvTextarea },
		setup() {
			return { args }
		},
		data: () => ({ inputValue: undefined }),
		template: /* html */ `
			<vv-textarea v-bind="args" v-model="inputValue" :data-testData="inputValue" data-testId="element">
				<template #before v-if="args.before"><div class="flex" v-html="args.before"></div></template>
				<template #after v-if="args.after"><div class="flex" v-html="args.after"></div></template>
				<template #hint v-if="args.hint"><span v-html="args.hint"></span></template>
			</vv-textarea>
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

export const Valid: Story = {
	...Default,
	args: {
		...defaultArgs,
		valid: true,
		validLabel: 'The field is valid.',
		icon: 'check',
	},
}

export const Invalid: Story = {
	...Default,
	args: {
		...defaultArgs,
		invalid: true,
		invalidLabel: 'The field is required.',
		icon: 'error-2',
	},
}

export const Hint: Story = {
	...Default,
	args: {
		...Default.args,
		hintLabel: 'Please enter your name.',
	},
}

export const Loading: Story = {
	...Default,
	args: {
		...Default.args,
		loading: true,
		loadingLabel: 'Loading...',
	},
}

export const Floating: Story = {
	...Default,
	args: {
		...Default.args,
		floating: true,
	},
}

export const Resizable: Story = {
	...Default,
	args: {
		...Default.args,
		resizable: true,
	},
}
