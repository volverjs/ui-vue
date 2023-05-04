import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import VvDropdown from '@/components/VvDropdown/VvDropdown.vue'
import VvDropdownAction from '@/components/VvDropdown/VvDropdownAction.vue'
import VvIcon from '@/components/VvIcon/VvIcon.vue'
import VvButton from '@/components/VvButton/VvButton.vue'
import { defaultTest } from './Dropdown.test'
import { defaultArgs, argTypes } from './Dropdown.settings'

const meta: Meta<typeof VvDropdown> = {
	title: 'Components/Dropdown',
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
		components: { VvDropdown, VvDropdownAction, VvIcon, VvButton },
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
				this.$refs.toggle?.$el?.scrollIntoView({
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
						<vv-button ref="toggle" class="absolute top-full left-full -translate-1/2" modifiers="full-bleed" data-testId="trigger">
							Toggle dropdown
						</vv-button>
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
				</div>
			</div>
		`,
	}),
	play: defaultTest,
}

export const Arrow: Story = {
	...Default,
	args: {
		...defaultArgs,
		arrow: true,
		offset: 10,
	},
}

export const AutoPlacement: Story = {
	...Default,
	args: {
		...defaultArgs,
		flip: false,
		autoPlacement: true,
		arrow: true,
		offset: 10,
	},
}

export const TriggerWidth: Story = {
	...Default,
	args: {
		...defaultArgs,
		triggerWidth: true,
	},
}
