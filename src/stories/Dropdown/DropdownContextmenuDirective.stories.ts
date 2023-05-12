import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { defaultArgs, argTypes } from './Dropdown.settings'
import VvDropdown from '@/components/VvDropdown/VvDropdown.vue'
import VvDropdownAction from '@/components/VvDropdown/VvDropdownAction.vue'
import VvIcon from '@/components/VvIcon/VvIcon.vue'

const meta: Meta<typeof VvDropdown> = {
	title: 'Directives/Contextmenu',
	component: VvDropdown,
	args: defaultArgs,
	argTypes,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvDropdown>

export const Default: Story = {
	args: {
		...defaultArgs,
	},
	render: (args) => ({
		components: { VvDropdown, VvDropdownAction, VvIcon },
		setup() {
			const dropdownEl = ref(null)
			return { args, dropdownEl }
		},
		template: /* html */ `
			<div v-contextmenu="dropdownEl" class="w-full h-320 bg-surface-1 flex items-center justify-center">
				<div class="text-word-2 text-18 uppercase w-150 text-center">Right click context menu</div>
			</div>
			<vv-dropdown v-bind="args" ref="dropdownEl">
				<template #items>
					<vv-dropdown-action>
						<vv-icon name="add" /> Create
					</vv-dropdown-action>
					<vv-dropdown-action>
						<vv-icon name="edit" /> Update
					</vv-dropdown-action>
					<vv-dropdown-action>
						<vv-icon name="trash" /> Delete
					</vv-dropdown-action>
				</template>
			</vv-dropdown>
		`,
	}),
}
