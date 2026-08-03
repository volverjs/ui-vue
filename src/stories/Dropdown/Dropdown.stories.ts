import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import VvButton from '@/components/VvButton/VvButton.vue'
import VvDropdown from '@/components/VvDropdown/VvDropdown.vue'
import VvDropdownAction from '@/components/VvDropdown/VvDropdownAction.vue'
import VvIcon from '@/components/VvIcon/VvIcon.vue'
import { argTypes, defaultArgs } from './Dropdown.settings'
import {
    defaultTest,
    topLayerExpandedOnMountTest,
    topLayerTest,
} from './Dropdown.test'

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
    render: args => ({
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
			<div style="min-height: 200px">
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

// A trigger inside a panel with its own stacking context, below a bar that
// declares a higher z-index: the layout that traps an in-flow dropdown
const topLayerTemplate = /* html */ `
	<div style="padding-top: 240px">
		<div
			data-testId="bar"
			style="position: relative; z-index: 100; height: 48px; display: flex; align-items: center; padding: 0 16px; background: var(--color-surface-1); border-bottom: 1px solid var(--color-surface-3)">
			Bar with a higher z-index
		</div>
		<div
			ref="wrapper"
			data-testId="wrapper"
			style="position: relative; z-index: 1; height: 140px; overflow: auto; padding: 8px 16px; background: var(--color-surface)">
			<vv-dropdown v-model="expanded" v-bind="args">
				<vv-button data-testId="trigger">
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
`

function topLayerRender(expandedOnMount = false) {
    return (args: Story['args']) => ({
        components: { VvDropdown, VvDropdownAction, VvIcon, VvButton },
        setup() {
            const expanded = ref(expandedOnMount)
            return { expanded, args }
        },
        template: topLayerTemplate,
    })
}

const topLayerArgs: Story['args'] = {
    ...defaultArgs,
    topLayer: true,
    placement: 'top',
    flip: false,
    offset: 8,
}

/**
 * Without `topLayer` the dropdown is trapped in the panel and painted under the
 * bar, whatever its own `z-index`: the Popover API takes it out to the top
 * layer.
 */
export const TopLayer: Story = {
    args: topLayerArgs,
    render: topLayerRender(),
    play: topLayerTest,
}

/**
 * The dropdown is expanded through its model on mount: it reaches the top layer
 * without any interaction.
 */
export const TopLayerExpandedOnMount: Story = {
    args: topLayerArgs,
    render: topLayerRender(true),
    play: topLayerExpandedOnMountTest,
}
