import type { Meta, StoryObj } from '@storybook/vue3'
import VvRadioGroup from '@/components/VvRadioGroup/VvRadioGroup.vue'
import VvRadio from '@/components/VvRadio/VvRadio.vue'
import { defaultArgs, argTypes } from './RadioGroup.settings'
import { defaultTest } from './RadioGroup.test'

const meta: Meta<typeof VvRadioGroup> = {
	title: 'Components/RadioGroup/Slots',
	component: VvRadioGroup,
	args: defaultArgs,
	argTypes,
}

export default meta

type Story = StoryObj<typeof VvRadioGroup>

export const Default: Story = {
	args: {
		...defaultArgs,
	},
	render: (args) => ({
		components: { VvRadioGroup, VvRadio },
		setup() {
			return { args }
		},
		data: () => ({ inputValue: undefined }),
		template: /* html */ `
			<vv-radio-group v-bind="args" v-model="inputValue" :data-testData="inputValue" data-testId="element">
				<vv-radio id="o1" name="opts" value="1">Option 1</vv-radio>
				<vv-radio id="o2" name="opts" value="2">Option 2</vv-radio>
				<vv-radio id="o3" name="opts" value="3">Option 3</vv-radio>
				<template #hint v-if="args.hint"><span v-html="args.hint"></span></template>
			</vv-radio-group>
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
