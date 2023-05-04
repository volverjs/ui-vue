import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import VvDropdown from '@/components/VvDropdown/VvDropdown.vue'
import VvIcon from '@/components/VvIcon/VvIcon.vue'
import VvDropdownAction from '@/components/VvDropdown/VvDropdownAction.vue'
import { defaultTest } from './Dropdown.test'
import { defaultArgs, argTypes } from './Dropdown.settings'

const meta: Meta<typeof VvDropdown> = {
	title: 'Components/Dropdown/Slots',
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
			const expanded = ref(false)
			return { expanded, args }
		},
		watch: {
			expanded(newValue) {
				if (!newValue) {
					return
				}
				setTimeout(() => {
					this.centerWrapper()
				}, 300)
			},
		},
		methods: {
			centerWrapper() {
				document.getElementById('toggle-button')?.scrollIntoView({
					inline: 'center',
					block: 'center',
				})
			},
		},
		mounted() {
			this.centerWrapper()
		},
		template: /* html */ `
			<div class="absolute inset-0 overflow-auto" ref="container">
				<div style="width: 200%; height: 200%" ref="wrapper" data-testId="wrapper">
					<vv-dropdown v-model="expanded" v-bind="args">
						<template #before v-if="args.before"><div v-html="args.before"></div></template>
						<template #default="{ init, toggle, aria }">
							<button :ref="(e) => init(e)" v-bind="aria" id="toggle-button" class="absolute cursor-pointer bg-info p-lg text-center top-full left-full -translate-1/2" data-testId="trigger" @click="toggle">
								Toggle dropdown
							</button>
						</template>
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
						<template #after v-if="args.after"><div v-html="args.after"></div></template>
					</vv-dropdown>
				</div>
			</div>
		`,
	}),
	play: defaultTest,
}

export const Before: Story = {
	...Default,
	args: {
		...Default.args,
		before: '<div class="bg-warning p-xs text-center">Before</div>',
	},
}

export const After: Story = {
	...Default,
	args: {
		...Default.args,
		after: '<div class="bg-danger text-white p-xs text-center">After</div>',
	},
}