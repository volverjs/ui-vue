import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvAlertGroup from '@/components/VvAlertGroup/VvAlertGroup.vue'
import VvButton from '@/components/VvButton/VvButton.vue'
import { useAlert } from '@/composables/alert/useAlert'

const meta: Meta = {
    title: 'Composables/useAlert',
    tags: ['autodocs'],
}

export default meta

export const Default: StoryObj = {
    parameters: {
        docs: {
            canvas: {
                sourceState: 'shown',
            },
            source: {
                code: `<script setup lang="ts">
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

<template>
  <div class="flex gap-md">
    <vv-button label="Show success" modifiers="secondary" @click="showSuccess" class="mb-lg" />
    <vv-button label="Show danger" modifiers="secondary" @click="showDanger" class="mb-lg" />
    <vv-button label="Show warning" modifiers="secondary" @click="showWarning" class="mb-lg" />
    <vv-button label="Show info" modifiers="secondary" @click="showInfo" class="mb-lg" />
  </div>
  <vv-alert-group :items="alerts" :on-close="removeAlert" />
</template>`,
            },
        },
    },
    render: args => ({
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
			<vv-alert-group name="test" v-bind="args" :items="alerts" :onClose="removeAlert" data-testId="element" />
        `,
    }),
}
