import type { Meta, StoryObj } from '@storybook/vue3'
import VvAccordionGroup from '@/components/VvAccordionGroup/VvAccordionGroup.vue'
import { defaultTest } from './AccordionGroup.test'
import { defaultArgs, argTypes } from './AccordionGroup.settings'

export default {
	title: 'Components/AccordionGroup',
	component: VvAccordionGroup,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
} as Meta<typeof VvAccordionGroup>

export type Story = StoryObj<typeof VvAccordionGroup>

export const Default: Story = {
	args: defaultArgs,
	play: defaultTest,
	render: (args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { VvAccordionGroup },
		setup() {
			return { args }
		},
		data() {
			return {
				selected: null,
			}
		},
		template: /*html*/ `
		<vv-accordion-group data-testId="element" v-bind="args" v-model="selected" />
		<div class="mt-24">
			{{ args.not ? 'Closed' : 'Opened'}}: <span data-testId="value">{{ selected }}</span>
		</div>
	`,
	}),
}

export const Not: Story = {
	...Default,
	args: {
		...defaultArgs,
		not: true,
	},
}

export const Collapse: Story = {
	...Default,
	args: {
		...defaultArgs,
		collapse: true,
	},
}

export const CollapseNot: Story = {
	...Default,
	args: {
		...defaultArgs,
		collapse: true,
		not: true,
	},
}
