import type { Meta, StoryObj } from '@storybook/vue3'
import VvButton from '@/components/VvButton/VvButton.vue'
import VvButtonGroup from '@/components/VvButtonGroup/VvButtonGroup.vue'
import { defaultArgs, argTypes } from './ButtonGroup.settings'
import { defaultTest } from './ButtonGroup.test'

const meta: Meta<typeof VvButtonGroup> = {
	title: 'Components/ButtonGroup/Slots',
	component: VvButtonGroup,
	args: defaultArgs,
	argTypes,
}

export default meta

type Story = StoryObj<typeof VvButtonGroup>

export const Default: Story = {
	args: {
		...defaultArgs,
	},
	render: (args) => ({
		components: { VvButton, VvButtonGroup },
		setup() {
			return { args }
		},
		data: () => ({ value: undefined }),
		template: /*html*/ `
			<vv-button-group v-bind="args" v-model="value" data-testId="button-group">
				<vv-button modifiers="primary" name="1a" data-testId="first-button">Button 1</vv-button>
				<vv-button modifiers="secondary" name="2b">Button 2</vv-button>
				<vv-button modifiers="danger" name="3c">Button 3</vv-button>
			</vv-button-group>
			<div v-if="args.toggle" class="mt-md">Value: {{ value }}</div>
		`,
	}),
	play: defaultTest,
}
