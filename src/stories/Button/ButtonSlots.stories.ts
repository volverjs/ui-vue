import type { Meta, StoryObj } from '@storybook/vue3'
import VvButton from '@/components/VvButton/VvButton.vue'
import VvBadge from '@/components/VvBadge/VvBadge.vue'
import { Default } from './Button.stories'
import { argTypes, defaultArgs } from './Button.settings'

const meta: Meta<typeof VvButton> = {
	title: 'Components/Button/Slots',
	component: VvButton,
	args: defaultArgs,
	argTypes,
}

export default meta

type Story = StoryObj<typeof VvButton>

export const DefaultSlot: Story = {
	...Default,
	args: {
		...Default.args,
		default: 'Default <em class="italic">slot!</em>',
	},
}

export const Before: Story = {
	...Default,
	args: {
		...Default.args,
		label: 'Before slot',
	},
	render: (args) => ({
		components: { VvButton, VvBadge },
		setup() {
			return { args }
		},
		template: /*html*/ `
			<vv-button v-bind="args" data-testId="element">
				<template #before>
					<vv-badge value="12" modifiers="danger" />
				</template>
			</vv-button>
		`,
	}),
}

export const After: Story = {
	...Default,
	args: {
		...Default.args,
		label: 'After slot',
	},
	render: (args) => ({
		components: { VvButton, VvBadge },
		setup() {
			return { args }
		},
		template: /*html*/ `
			<vv-button v-bind="args" data-testId="element">
				<template #after>
					<vv-badge value="12" modifiers="danger" />
				</template>
			</vv-button>
		`,
	}),
}

export const Label: Story = {
	...Default,
	args: {
		...Default.args,
		icon: 'add',
	},
	render: (args) => ({
		components: { VvButton },
		setup() {
			return { args }
		},
		template: /*html*/ `
			<vv-button v-bind="args" data-testId="element">
				<template #label>
					Label <em class="italic">slot!</em>
				</template>
			</vv-button>
		`,
	}),
}
