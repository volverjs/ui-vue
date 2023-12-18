import type { Meta, StoryObj } from '@storybook/vue3'
import VvInputFile from '@/components/VvInputFile/VvInputFile.vue'
import { defaultArgs, argTypes } from './InputFile.settings'

const meta: Meta = {
	title: 'Components/InputFile',
	component: VvInputFile,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvInputFile>

export const Default: Story = {
	args: {
		...defaultArgs,
	},
	render: (args) => ({
		components: { VvInputFile },
		setup() {
			const files = ref([])
			return {
				args,
				files,
			}
		},
		template: /* html */ `
			<div class="w-1/4">
				<vv-input-file v-bind="args" v-model="files">
					<template #drop-area v-if="args['drop-area']"><div v-html="args['drop-area']"></div></template>
					<template #hint v-if="args['hint']"><div v-html="args['hint']"></div></template>
				</vv-input-file>
			</div>
		`,
	}),
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
	},
}

export const Invalid: Story = {
	...Default,
	args: {
		...defaultArgs,
		invalid: true,
		invalidLabel: 'The field is required.',
	},
}

export const Hint: Story = {
	...Default,
	args: {
		...defaultArgs,
		hintLabel: 'Please upload a file.',
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

export const IconLeft: Story = {
	...Default,
	args: {
		...defaultArgs,
		iconLeft: 'material-symbols:cloud-outline',
	},
}

export const IconRight: Story = {
	...Default,
	args: {
		...defaultArgs,
		iconRight: 'akar-icons:heart',
	},
}
