import type { Meta } from '@storybook/vue3'
import VvAlert from '@/components/VvAlert/VvAlert.vue'
import VvButton from '@/components/VvButton/VvButton.vue'
import VvAlertGroup from '@/components/VvAlertGroup/VvAlertGroup.vue'
import { defaultArgs, argTypes } from './AlertGroup.settings'
import { Default as DefaultStory, type Story } from './AlertGroup.stories'

const meta: Meta<typeof VvAlert> = {
	title: 'Components/AlertGroup/Slots',
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
		components: { VvAlert, VvAlertGroup },
		setup() {
			return { args }
		},
		template: /*html*/ `
            <vv-alert-group v-bind="args" data-testId="element">
                <vv-alert title="Success!" content="This is an success message." modifiers="success" />
                <vv-alert title="Accent!" content="This is an accent message." modifiers="accent" />
            </vv-alert-group>
		`,
	}),
}

export const Before: Story = {
	...DefaultStory,
	args: {
		...defaultArgs,
		modifiers: ['notification'],
	},
	render: (args) => ({
		components: { VvButton, VvAlertGroup },
		setup() {
			return { args }
		},
		template: /*html*/ `
            <vv-alert-group v-bind="args" data-testId="element">
                <template #before>
                    <div class="flex justify-center">
                        <vv-button label="Clear All" icon="close" modifiers="action-quiet" />
                    </div>
                </template>
            </vv-alert-group>
		`,
	}),
}

export const After: Story = {
	...DefaultStory,
	args: {
		...defaultArgs,
		modifiers: ['notification'],
	},
	render: (args) => ({
		components: { VvButton, VvAlertGroup },
		setup() {
			return { args }
		},
		template: /*html*/ `
            <vv-alert-group v-bind="args" data-testId="element">
                <template #after>
                    <div class="flex justify-center">
                        <vv-button label="Clear All" icon="close" modifiers="action-quiet" />
                    </div>
                </template>
            </vv-alert-group>
		`,
	}),
}
