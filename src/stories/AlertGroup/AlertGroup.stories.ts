import type { Meta, StoryObj } from '@storybook/vue3'
import VvAlertGroup from '@/components/VvAlertGroup/VvAlertGroup.vue'
import { defaultTest } from './AlertGroup.test'
import { defaultArgs, argTypes } from './AlertGroup.settings'

const meta: Meta<typeof VvAlertGroup> = {
	title: 'Components/AlertGroup',
	component: VvAlertGroup,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
}

export default meta

export type Story = StoryObj<typeof VvAlertGroup>

export const Default: Story = {
	args: defaultArgs,
	play: defaultTest,
	render: (args) => ({
		components: { VvAlertGroup },
		setup() {
			return { args }
		},
		template: /* html */ `
            <vv-alert-group v-bind="args" data-testId="element">
                <template #before v-if="args.before"><div v-html="args.before"></div></template>
                <template #after v-if="args.after"><div v-html="args.after"></div></template>
                <template #default v-if="args.default"><div v-html="args.default"></div></template>
            </vv-alert-group>
        `,
	}),
}

export const Stack: Story = {
	...Default,
	args: {
		...defaultArgs,
		stack: true,
	},
}

export const Reverse: Story = {
	...Default,
	args: {
		...defaultArgs,
		reverse: true,
	},
}
