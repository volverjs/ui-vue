import type { Meta, StoryObj } from '@storybook/vue3'
import VvCard from '@/components/VvCard/VvCard.vue'
import { defaulTest } from './Card.test'
import { defaultArgs, argTypes } from './Card.settings'

const meta: Meta<typeof VvCard> = {
	title: 'Components/Card',
	component: VvCard,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvCard>

const Template: Story = {
	args: {
		...defaultArgs,
	},
	render: (args) => ({
		components: { VvCard },
		setup() {
			return { args }
		},
		template: /*html*/ `
			<vv-card v-bind="args" data-testId="card">
				<template #default v-if="args.default"><div v-html="args.default"></div></template>
				<template #header v-if="args.header"><div v-html="args.header"></div></template>
				<template #content v-if="args.content"><div v-html="args.content"></div></template>
				<template #footer v-if="args.footer"><div v-html="args.footer"></div></template>
			</vv-card>
		`,
	}),
	play: defaulTest,
}

export const Default: Story = {
	...Template,
	args: {
		...defaultArgs,
		content:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean turpis diam, tempor non sem ut, suscipit gravida mi.',
	},
}
