import type { Meta, StoryObj } from '@storybook/vue3'
import VvBadge from '@/components/VvBadge/VvBadge.vue'
import { defaultTest } from './Badge.test'
import { defaultArgs, argTypes } from './Badge.settings'

const meta: Meta<typeof VvBadge> = {
	title: 'Components/Badge',
	component: VvBadge,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvBadge>

export const Default: Story = {
	args: {
		...defaultArgs,
		value: 14
	},
	render: (args) => ({
		components: { VvBadge },
		setup() {
			return { args }
		},
		template: /*html*/ `
			<vv-badge v-bind="args">
				<template #default v-if="args.default"><span v-html="args.default"></span></template>	
			</vv-badge>
		`,
	}),
	play: defaultTest,
}

export const Dot: Story = {
	...Default,
	args: {
		...defaultArgs,
		value: '',
	},
}
