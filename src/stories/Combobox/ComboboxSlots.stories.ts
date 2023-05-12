import type { Meta, StoryObj } from '@storybook/vue3'
import VvCombobox from '@/components/VvCombobox/VvCombobox.vue'
import VvIcon from '@/components/VvIcon/VvIcon.vue'
import { Default } from './Combobox.stories'
import { defaultArgs, argTypes } from './Combobox.settings'
import { defaultTest } from './Combobox.test'

const meta: Meta<typeof VvCombobox> = {
	title: 'Components/Combobox/Slots',
	component: VvCombobox,
	args: defaultArgs,
	argTypes,
}

export default meta

type Story = StoryObj<typeof VvCombobox>

export const Before: Story = {
	...Default,
	args: {
		...Default.args,
		before: '<div class="vv-badge vv-badge--sm vv-badge--gray vv-badge--outline uppercase">Before</div>',
	},
}

export const After: Story = {
	...Default,
	args: {
		...Default.args,
		after: '<div class="vv-badge vv-badge--sm vv-badge--gray vv-badge--outline uppercase">After</div>',
	},
}

export const Value: Story = {
	args: {
		...Default.args,
		multiple: true,
	},
	render: (args) => ({
		components: { VvCombobox },
		setup() {
			return { args }
		},
		data() {
			return {
				inputValue: undefined,
			}
		},
		template: /*html*/ `
				<vv-combobox v-bind="args" v-model="inputValue" :data-testData="inputValue" data-testId="element">
					<template #before v-if="args.before"><div class="pl-sm flex" v-html="args.before"></div></template>
					<template #hint v-if="args.hint"><span v-html="args.hint"></span></template>
					<template #after v-if="args.after"><div class="pr-sm flex" v-html="args.after"></div></template>
					<template #value="{ selectedOptions }">
						<div v-for="(option, index) in selectedOptions" :key="index" class="vv-badge vv-badge--sm vv-badge--rounded vv-badge--outline uppercase">{{option}}</div>
					</template>
				</vv-combobox>
				<div>Value: <span data-testId="value">{{inputValue}}</span></div> 
			`,
	}),
	play: defaultTest,
}

export const Option: Story = {
	args: {
		...Default.args,
		multiple: true,
	},
	render: (args) => ({
		components: { VvCombobox, VvIcon },
		setup() {
			return { args }
		},
		data() {
			return {
				inputValue: undefined,
			}
		},
		template: /*html*/ `
				<vv-combobox v-bind="args" v-model="inputValue" :data-testData="inputValue" data-testId="element">
					<template #before v-if="args.before"><div class="pl-sm flex" v-html="args.before"></div></template>
					<template #hint v-if="args.hint"><span v-html="args.hint"></span></template>
					<template #after v-if="args.after"><div class="pr-sm flex" v-html="args.after"></div></template>
					<template #option="{ option, selected }">
						<div class="flex flex-1 items-center">
							<vv-icon :name="selected ? 'check-circle' : 'circle'" />
							<div class="flex-1 pl-sm">{{ option }}</div>
						</div>
					</template>
				</vv-combobox>
				<div>Value: <span data-testId="value">{{inputValue}}</span></div> 
			`,
	}),
	play: defaultTest,
}

export const Hint: Story = {
	...Default,
	args: {
		...Default.args,
		hint: 'Hint <em class="italic">slot!</em>',
	},
}
