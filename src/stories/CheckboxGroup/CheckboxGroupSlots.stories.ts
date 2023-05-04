import type { Meta, StoryObj } from '@storybook/vue3'
import VvCheckboxGroup from '@/components/VvCheckboxGroup/VvCheckboxGroup.vue'
import VvCheckbox from '@/components/VvCheckbox/VvCheckbox.vue'
import { defaultArgs, argTypes } from './CheckboxGroup.settings'
import { defaultTest } from './CheckboxGroup.test'

const meta: Meta<typeof VvCheckboxGroup> = {
	title: 'Components/CheckboxGroup/Slots',
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
		components: { VvCheckboxGroup, VvCheckbox },
		setup() {
			return { args }
		},
		data: () => ({ inputValue: undefined }),
		template: /* html */ `
			<vv-checkbox-group v-bind="args" v-model="inputValue" :data-testData="inputValue" data-testId="element">
				<vv-checkbox id="o1" name="opts" value="1">Option 1</vv-checkbox>
				<vv-checkbox id="o2" name="opts" value="2">Option 2</vv-checkbox>
				<vv-checkbox id="o3" name="opts" value="3">Option 3</vv-checkbox>
				<template #hint v-if="args.hint"><span v-html="args.hint"></span></template>
			</vv-checkbox-group>
			<div>Value: <span data-testId="value">{{inputValue}}</span></div>
		`,
	}),
	play: defaultTest,
}

export const Hint: Story = {
	...Default,
	args: {
		...defaultArgs,
		hint: 'Hint <em class="italic">slot!</em>',
	},
}
