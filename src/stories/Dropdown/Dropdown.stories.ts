import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref } from 'vue'
import VvButton from '@/components/VvButton/VvButton.vue'
import VvDropdown from '@/components/VvDropdown/VvDropdown.vue'
import VvDropdownAction from '@/components/VvDropdown/VvDropdownAction.vue'
import VvIcon from '@/components/VvIcon/VvIcon.vue'
import { argTypes, defaultArgs } from './Dropdown.settings'
import {
    contentChangesWhileOpenTest,
    defaultTest,
    flipNearViewportBottomTest,
    idClearedTest,
    noResizeObserverLoopTest,
    reopenAfterResizeTest,
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

/**
 * A trigger held at a fixed place of the viewport, with a list of `count`
 * actions
 */
function renderFixedTrigger(position: string, count = 3) {
    return (args: Story['args']) => ({
        components: { VvDropdown, VvDropdownAction, VvButton },
        setup() {
            const actions = Array.from({ length: count }, (_, i) => `Action ${i + 1}`)
            return { args, actions }
        },
        template: /* html */ `
			<div data-testId="wrapper" style="position: fixed; inset-inline: 16px; ${position}">
				<vv-dropdown v-bind="args">
					<vv-button data-testId="trigger" label="Toggle dropdown" />
					<template #items>
						<vv-dropdown-action v-for="action in actions" :key="action">
							{{ action }}
						</vv-dropdown-action>
					</template>
				</vv-dropdown>
			</div>
		`,
    })
}

// a fixed story would sit over the docs page, unless its block contains it
const containedInDocs = { docs: { story: { height: '320px' } } }

/**
 * The trigger sits near the bottom of the viewport, as on the last row of a
 * long table: with no room below, the dropdown opens above it at its full
 * height.
 */
export const FlipNearViewportBottom: Story = {
    args: {
        ...defaultArgs,
        strategy: 'fixed',
        offset: 5,
    },
    parameters: containedInDocs,
    render: renderFixedTrigger('bottom: 48px'),
    play: flipNearViewportBottomTest,
}

/**
 * The same with the default `absolute` strategy.
 */
export const FlipNearViewportBottomAbsolute: Story = {
    args: {
        ...defaultArgs,
        offset: 5,
    },
    parameters: containedInDocs,
    render: renderFixedTrigger('bottom: 48px'),
    play: flipNearViewportBottomTest,
}

/**
 * A list with no room on either side opens capped. The container then grows,
 * and the dropdown opens again at the height of its items, above the trigger.
 */
export const ReopenAfterResize: Story = {
    args: {
        ...defaultArgs,
    },
    render: args => ({
        components: { VvDropdown, VvDropdownAction, VvButton },
        setup() {
            const actions = Array.from({ length: 6 }, (_, i) => `Action ${i + 1}`)
            return { args, actions }
        },
        template: /* html */ `
			<div data-testId="container" style="position: relative; overflow: auto; height: 300px">
				<div data-testId="anchor" style="position: absolute; inset-inline: 16px; top: 130px">
					<vv-dropdown v-bind="args">
						<vv-button data-testId="trigger" label="Toggle dropdown" />
						<template #items>
							<vv-dropdown-action v-for="action in actions" :key="action">
								{{ action }}
							</vv-dropdown-action>
						</template>
					</vv-dropdown>
				</div>
			</div>
		`,
    }),
    play: reopenAfterResizeTest,
}

/**
 * A list taller than the room on either side opens capped, with no
 * ResizeObserver loop error.
 */
export const NoResizeObserverLoop: Story = {
    args: {
        ...defaultArgs,
        strategy: 'fixed',
        offset: 5,
    },
    parameters: containedInDocs,
    render: renderFixedTrigger('top: 45vh', 40),
    play: noResizeObserverLoopTest,
}

/**
 * The items change while the dropdown is open, as in a list filtered by a
 * search: the dropdown moves to the side that has room for them.
 */
export const ContentChangesWhileOpen: Story = {
    args: {
        ...defaultArgs,
        strategy: 'fixed',
        offset: 5,
        keepOpen: true,
        // as wide as the trigger, so that only the height follows the items
        triggerWidth: true,
    },
    parameters: containedInDocs,
    render: args => ({
        components: { VvDropdown, VvDropdownAction, VvButton },
        setup() {
            const count = ref(1)
            const actions = computed(() =>
                Array.from({ length: count.value }, (_, i) => `Action ${i + 1}`),
            )
            return { args, count, actions }
        },
        template: /* html */ `
			<div class="flex gap-sm">
				<button v-for="value in [6, 10, 40]" :key="value" class="vv-button" @click="count = value">{{ value }} actions</button>
			</div>
			<div data-testId="wrapper" style="position: fixed; inset-inline: 16px; bottom: 150px">
				<vv-dropdown v-bind="args">
					<vv-button data-testId="trigger" label="Toggle dropdown" />
					<template #items>
						<vv-dropdown-action v-for="action in actions" :key="action">
							{{ action }}
						</vv-dropdown-action>
					</template>
				</vv-dropdown>
			</div>
		`,
    }),
    play: contentChangesWhileOpenTest,
}

/**
 * The `id` is cleared after mount: the dropdown falls back to an id of its own,
 * which the trigger keeps pointing at.
 */
export const IdCleared: Story = {
    args: defaultArgs,
    render: args => ({
        components: { VvDropdown, VvDropdownAction, VvButton },
        setup() {
            const id = ref('menu')
            return { args, id }
        },
        template: /* html */ `
			<vv-dropdown v-bind="args" :id="id">
				<vv-button data-testId="trigger" label="Menu" />
				<template #items>
					<vv-dropdown-action>Action</vv-dropdown-action>
				</template>
			</vv-dropdown>
			<vv-button data-testId="clear" class="mt-24" label="Clear the id" modifiers="secondary" :disabled="!id" @click="id = ''" />
		`,
    }),
    play: idClearedTest,
}
