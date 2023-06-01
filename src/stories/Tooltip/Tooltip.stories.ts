import type { Meta, StoryObj } from '@storybook/vue3'
import VvTooltip from '@/components/VvTooltip/VvTooltip.vue'
import VvButton from '@/components/VvButton/VvButton.vue'
import { defaultArgs, argTypes } from './Tooltip.settings'
import { defaultTest } from './Tooltip.test'

const meta: Meta<typeof VvTooltip> = {
	title: 'Components/Tooltip',
	component: VvTooltip,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvTooltip>

export const Default: Story = {
	args: {
		...defaultArgs,
	},
	render: (args) => ({
		components: { VvButton, VvTooltip },
		setup() {
			return { args }
		},
		template: /* html */ `
			<div class="w-full h-150">
				<vv-button class="absolute left-1/2 top-1/2 -translate-1/2" data-testId="parent">
					Hover me
					<vv-tooltip v-bind="args">
						<template #default v-if="args.default"><div v-html="args.default"></div></template>
					</vv-tooltip>
				</vv-button>
			</div>
		`,
	}),
	play: defaultTest,
}
