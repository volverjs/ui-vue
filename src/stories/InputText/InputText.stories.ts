import type { Meta, StoryObj } from '@storybook/vue3'
import VvInputText from '@/components/VvInputText/VvInputText.vue'
import { defaultArgs, argTypes } from './InputText.settings'
import { defaultTest } from './InputText.test'
import { Position } from '@/constants'

const meta: Meta<typeof VvInputText> = {
	title: 'Components/InputText',
	component: VvInputText,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvInputText>

export const Default: Story = {
	args: {
		...defaultArgs,
	},
	render: (args) => ({
		components: { VvInputText },
		setup() {
			return { args }
		},
		data: () => ({ inputValue: undefined }),
		template: /* html */ `
			<vv-input-text v-bind="args" v-model="inputValue" :data-testData="inputValue" data-testId="element">
				<template #before v-if="args.before"><div class="flex" v-html="args.before"></div></template>
				<template #after v-if="args.after"><div class="flex" v-html="args.after"></div></template>
				<template #hint v-if="args.hint"><span v-html="args.hint"></span></template>
			</vv-input-text>
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
		iconPosition: Position.after,
	},
}

export const Invalid: Story = {
	...Default,
	args: {
		...defaultArgs,
		invalid: true,
		invalidLabel: 'The field is required.',
		icon: 'error-2',
		iconPosition: Position.after,
	},
}

export const Hint: Story = {
	...Default,
	args: {
		...defaultArgs,
		hintLabel: 'Please enter your name.',
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

export const Mask: Story = {
	...Default,
	args: {
		...defaultArgs,
		mask: '##-###-##',
	},
}

export const Unit: Story = {
	...Default,
	args: {
		...defaultArgs,
		unit: 'km',
		autoWidth: true,
		type: 'number',
	},
}
