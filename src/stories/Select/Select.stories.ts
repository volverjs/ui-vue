import type { Meta, StoryObj } from '@storybook/vue3'
import VvSelect from '@/components/VvSelect/VvSelect.vue'
import { defaultTest } from './Select.test'
import { defaultArgs, argTypes } from './Select.settings'

const meta: Meta<typeof VvSelect> = {
	title: 'Components/Select',
	component: VvSelect,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvSelect>

export const Default: Story = {
	args: {
		...defaultArgs,
	},
	render: (args) => ({
		components: { VvSelect },
		setup() {
			return { args }
		},
		data: () => ({ inputValue: undefined }),
		template: /*html*/ `
			<vv-select v-bind="args" v-model="inputValue" :data-testData="inputValue" data-testId="element">
				<template #before v-if="args.before"><div class="flex" v-html="args.before"></div></template>
				<template #after v-if="args.after"><div class="flex" v-html="args.after"></div></template>
				<template #hint v-if="args.hint"><span v-html="args.hint"></span></template>
			</vv-select>
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

export const Multiple: Story = {
	...Default,
	args: {
		...defaultArgs,
		multiple: true,
	},
}

export const Unselectable: Story = {
	...Default,
	args: {
		...defaultArgs,
		unselectable: true,
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

export const Invalid: Story = {
	...Default,
	args: {
		...defaultArgs,
		invalid: true,
		invalidLabel: 'Selected response is invalid.',
	},
}

export const Hint: Story = {
	...Default,
	args: {
		...defaultArgs,
		hintLabel: 'Please fill the input above.',
	},
}

export const Loading: Story = {
	...Default,
	args: {
		...defaultArgs,
		loading: true,
		loadingLabel: 'Loading...',
	},
}

export const Floating: Story = {
	...Default,
	args: {
		...defaultArgs,
		floating: true,
	},
}
