import type { Meta } from '@storybook/vue3'
import VvAlert from '@/components/VvAlert/VvAlert.vue'
import VvButton from '@/components/VvButton/VvButton.vue'
import VvButtonGroup from '@/components/VvButtonGroup/VvButtonGroup.vue'
import { defaultArgs, argTypes } from './Alert.settings'
import { Default as DefaultStory, type Story } from './Alert.stories'

const meta: Meta<typeof VvAlert> = {
	title: 'Components/Alert/Slots',
	component: VvAlert,
	args: defaultArgs,
	argTypes,
}

export default meta

export const Default: Story = {
	...DefaultStory,
	args: {
		...defaultArgs,
		modifiers: ['notification'],
	},
	render: (args) => ({
		components: { VvAlert },
		setup() {
			return { args }
		},
		template: /*html*/ `
			<vv-alert v-bind="args" data-testId="element" >
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
				<div class="mt-sm">Default <em class="italic">slot!</em></div>
			</vv-alert>
		`,
	}),
}

export const Header: Story = {
	...DefaultStory,
	args: {
		...defaultArgs,
		header: 'Header <em class="italic">slot!</em>',
	},
}

export const TitleBefore: Story = {
	...DefaultStory,
	args: {
		...defaultArgs,
		modifiers: ['notification'],
	},
	render: (args) => ({
		components: { VvAlert },
		setup() {
			return { args }
		},
		template: /*html*/ `
			<vv-alert v-bind="args" data-testId="element" >
				<template #title::before>
                    <small class="text-smaller flex-1">10 minutes ago</small>
				</template>
			</vv-alert>
		`,
	}),
}

export const TitleAfter: Story = {
	...DefaultStory,
	args: {
		...defaultArgs,
		modifiers: ['notification'],
	},
	render: (args) => ({
		components: { VvAlert },
		setup() {
			return { args }
		},
		template: /*html*/ `
			<vv-alert v-bind="args" data-testId="element" >
				<template #title::after>
                    <small class="text-smaller ml-auto">10 minutes ago</small>
				</template>
			</vv-alert>
		`,
	}),
}

export const Footer: Story = {
	...DefaultStory,
	args: {
		...defaultArgs,
		modifiers: ['notification'],
		role: 'alertdialog',
	},
	render: (args) => ({
		components: { VvAlert, VvButton, VvButtonGroup },
		setup() {
			return { args }
		},
		template: /*html*/ `
			<vv-alert v-bind="args" data-testId="element" >
				<template #footer>
                    <vv-button-group>
						<vv-button modifiers="action" label="Save" />
						<vv-button modifiers="action-quiet" label="Cancel" />
					</vv-button-group>
				</template>
			</vv-alert>
		`,
	}),
}
