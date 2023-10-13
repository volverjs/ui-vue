import type { Meta } from '@storybook/vue3'
import VvAlertGroup from '@/components/VvAlertGroup/VvAlertGroup.vue'
import VvButton from '@/components/VvButton/VvButton.vue'
import { defaultArgs, argTypes } from './AlertGroup.settings'
import { Default as DefaultStory, type Story } from './AlertGroup.stories'
import { useAlert } from '@/composables/alert/useAlert'

const meta: Meta<typeof VvAlertGroup> = {
	title: 'Composables/useAlert',
	component: VvAlertGroup,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
}

export default meta

export const Default: Story = {
	...DefaultStory,
	parameters: {
		docs: {
			source: {
				type: 'code',
				language: 'html',
				code: /* html */ `
<div class="flex gap-md">
	<vv-button label="Show success" modifiers="secondary" @click="showSuccess" class="mb-lg" />
	<vv-button label="Show danger" modifiers="secondary" @click="showDanger" class="mb-lg" />
	<vv-button label="Show warning" modifiers="secondary" @click="showWarning" class="mb-lg" />
	<vv-button label="Show info" modifiers="secondary" @click="showInfo" class="mb-lg" />
</div>
<vv-alert-group v-bind="args" :items="alerts" :onClose="removeAlert" data-testId="element" />

<script setup lang='ts'>
	import { useAlert } from '@volverjs/ui-vue/composables'

	const { addAlert, removeAlert, alerts } = useAlert()

	function showSuccess() {
		addAlert({
			title: 'Success!',
			modifiers: 'success',
		})
	}
	function showDanger() {
		addAlert({
			title: 'Danger!',
			modifiers: 'danger',
		})
	}
	function showWarning() {
		addAlert({
			title: 'Warning!',
			modifiers: 'warning',
		})
	}
	function showInfo() {
		addAlert({
			title: 'Info!',
			modifiers: 'info',
		})
	}
</script>
				`,
			},
		},
	},
	render: (args) => ({
		components: { VvAlertGroup, VvButton },
		setup() {
			const { addAlert, removeAlert, alerts } = useAlert()

			function showSuccess() {
				addAlert({
					title: 'Success!',
					modifiers: 'success',
				})
			}
			function showDanger() {
				addAlert({
					title: 'Danger!',
					modifiers: 'danger',
				})
			}
			function showWarning() {
				addAlert({
					title: 'Warning!',
					modifiers: 'warning',
				})
			}
			function showInfo() {
				addAlert({
					title: 'Info!',
					modifiers: 'info',
				})
			}

			return {
				args,
				alerts,
				removeAlert,
				showSuccess,
				showDanger,
				showWarning,
				showInfo,
			}
		},
		template: /* html */ `
			<div class="buttons-container flex gap-md" >
				<vv-button id="success" label="Show success" modifiers="secondary" @click="showSuccess" class="mb-lg" />
				<vv-button id="danger" label="Show danger" modifiers="secondary" @click="showDanger" class="mb-lg" />
				<vv-button id="warning" label="Show warning" modifiers="secondary" @click="showWarning" class="mb-lg" />
				<vv-button id="info" label="Show info" modifiers="secondary" @click="showInfo" class="mb-lg" />
			</div>
			<vv-alert-group v-bind="args" :items="alerts" :onClose="removeAlert" data-testId="element" />
        `,
	}),
}
