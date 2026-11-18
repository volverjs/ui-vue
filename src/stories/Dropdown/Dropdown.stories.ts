import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { App } from 'vue'
import { computed, createApp, onBeforeUnmount, onMounted, ref } from 'vue'
import VvButton from '@/components/VvButton/VvButton.vue'
import VvDropdown from '@/components/VvDropdown/VvDropdown.vue'
import VvDropdownAction from '@/components/VvDropdown/VvDropdownAction.vue'
import VvDropdownOption from '@/components/VvDropdown/VvDropdownOption.vue'
import VvIcon from '@/components/VvIcon/VvIcon.vue'
import VolverPlugin from '@/Volver'
import { argTypes, defaultArgs } from './Dropdown.settings'
import {
    actionClickTest,
    contentChangesWhileOpenTest,
    defaultTest,
    enterOnItemInShadowRootTest,
    enterOnItemTest,
    expandEventsTest,
    flipNearViewportBottomTest,
    idClearedTest,
    keyboardNavigationTest,
    noResizeObserverLoopTest,
    reopenAfterResizeTest,
    roomBelowTest,
    shadowRootTest,
    shiftTabOutTest,
    sizeApplyTest,
    tabOutInShadowRootTest,
    tabOutTest,
    topLayerExpandedOnMountTest,
    topLayerTest,
    triggerClickWhileOpenTest,
    triggerWidthAfterResizeTest,
    wrapperReferenceTest,
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

/**
 * The trigger fills a sidebar that a button closes and opens again: the
 * dropdown opens as wide as the trigger is now, and follows it when it changes
 * width while open.
 */
export const TriggerWidthAfterResize: Story = {
    args: {
        ...defaultArgs,
        // the same place at every width, so that the coordinates do not change
        placement: 'bottom-start',
        triggerWidth: true,
    },
    render: args => ({
        components: { VvDropdown, VvDropdownAction, VvButton },
        setup() {
            const sidebarOpen = ref(false)
            return { args, sidebarOpen }
        },
        // away from the edge, where "flip" would move the dropdown to keep the
        // padding of "size"
        template: /* html */ `
			<div class="p-lg">
				<vv-button data-testId="sidebar-toggle" label="Toggle sidebar" modifiers="secondary" @click="sidebarOpen = !sidebarOpen" />
				<div data-testId="sidebar" class="mt-md" :style="{ width: sidebarOpen ? '235px' : '63px', minHeight: '160px' }">
					<vv-dropdown v-bind="args">
						<vv-button data-testId="trigger" label="Menu" modifiers="block" />
						<template #items>
							<vv-dropdown-action>Create</vv-dropdown-action>
							<vv-dropdown-action>Update</vv-dropdown-action>
							<vv-dropdown-action>Delete</vv-dropdown-action>
						</template>
					</vv-dropdown>
				</div>
			</div>
		`,
    }),
    play: triggerWidthAfterResizeTest,
}

/**
 * The same without `size`, which the width does not depend on.
 */
export const TriggerWidthAfterResizeWithoutSize: Story = {
    ...TriggerWidthAfterResize,
    args: {
        ...TriggerWidthAfterResize.args,
        size: false,
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
 * Below the trigger there is room for the items, but not for the padding that
 * `size` keeps from the edge: the dropdown opens above, not capped a few pixels
 * short of its items.
 */
export const FlipWithinSizePadding: Story = {
    args: {
        ...defaultArgs,
        strategy: 'fixed',
    },
    parameters: containedInDocs,
    render: renderFixedTrigger('top: 100px'),
    play: roomBelowTest(5),
}

/**
 * Below the trigger there is room for the items, but not for the offset that
 * separates them from it: the dropdown opens above, not past the edge of the
 * viewport.
 */
export const FlipWithOffset: Story = {
    args: {
        ...defaultArgs,
        strategy: 'fixed',
        offset: 20,
    },
    parameters: containedInDocs,
    render: renderFixedTrigger('top: 100px'),
    play: roomBelowTest(15),
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

/**
 * `beforeExpand` and `afterExpand` around an opening, `beforeCollapse` and
 * `afterCollapse` around a closing.
 */
export const ExpandEvents: Story = {
    args: {
        ...defaultArgs,
    },
    render: args => ({
        components: { VvDropdown, VvDropdownAction, VvButton },
        setup() {
            const events = ref<string[]>([])
            return { args, events }
        },
        template: /* html */ `
			<div style="min-height: 120px">
				<vv-dropdown
					v-bind="args"
					@before-expand="events.push('beforeExpand')"
					@after-expand="events.push('afterExpand')"
					@before-collapse="events.push('beforeCollapse')"
					@after-collapse="events.push('afterCollapse')"
				>
					<vv-button data-testId="trigger" label="Toggle dropdown" />
					<template #items>
						<vv-dropdown-action>Create</vv-dropdown-action>
					</template>
				</vv-dropdown>
			</div>
			<output data-testId="events">{{ events.join(' ') }}</output>
		`,
    }),
    play: expandEventsTest,
}

/**
 * An `apply` passed in `size` runs, here to show the room left below the
 * trigger.
 */
export const SizeApply: Story = {
    args: {
        ...defaultArgs,
    },
    render: args => ({
        components: { VvDropdown, VvDropdownAction, VvButton },
        setup() {
            const room = ref('')
            const size = {
                padding: 10,
                apply: ({ availableHeight }: { availableHeight: number }) => {
                    room.value = `${Math.round(availableHeight)}`
                },
            }
            return { args, room, size }
        },
        template: /* html */ `
			<div style="min-height: 120px">
				<vv-dropdown v-bind="args" :size="size">
					<vv-button data-testId="trigger" label="Toggle dropdown" />
					<template #items>
						<vv-dropdown-action>Create</vv-dropdown-action>
					</template>
				</vv-dropdown>
			</div>
			<output data-testId="room">{{ room }}</output>
		`,
    }),
    play: sizeApplyTest,
}

// `aria-hidden="false"` hides nothing: Escape still gives the trigger the focus
const keyboardTemplate = /* html */ `
	<vv-dropdown v-bind="args">
		<vv-button data-testId="trigger" label="Toggle dropdown" aria-hidden="false" />
		<template #items>
			<vv-dropdown-action>Create</vv-dropdown-action>
			<vv-dropdown-action>Update</vv-dropdown-action>
			<vv-dropdown-action>Delete</vv-dropdown-action>
		</template>
	</vv-dropdown>
`

/**
 * The arrows move the focus through the items, Escape closes the dropdown and
 * gives the focus back to the trigger.
 */
export const KeyboardNavigation: Story = {
    args: {
        ...defaultArgs,
    },
    render: args => ({
        components: { VvDropdown, VvDropdownAction, VvButton },
        setup() {
            return { args }
        },
        template: /* html */ `
			<div style="min-height: 160px">${keyboardTemplate}</div>
		`,
    }),
    play: keyboardNavigationTest,
}

/**
 * Mounts `template` in an app of its own inside a shadow root, as a custom
 * element does, with the state `setup` returns. `light` is the content of the
 * host, which a `<slot>` in the shadow root draws.
 */
function renderInShadowRoot(
    template: string,
    setup: () => Record<string, unknown>,
    light = '',
) {
    return () => ({
        setup() {
            const host = ref<HTMLElement>()
            let app: App | undefined
            onMounted(() => {
                if (!host.value) {
                    return
                }
                const root = host.value.attachShadow({ mode: 'open' })
                // the page's styles, so the dropdown looks the same
                for (const sheet of document.querySelectorAll(
                    'style, link[rel="stylesheet"]',
                )) {
                    root.append(sheet.cloneNode(true))
                }
                const container = document.createElement('div')
                root.append(container)
                app = createApp({
                    components: {
                        VvDropdown,
                        VvDropdownAction,
                        VvDropdownOption,
                        VvButton,
                    },
                    setup,
                    template,
                })
                app.use(VolverPlugin)
                app.mount(container)
            })
            onBeforeUnmount(() => app?.unmount())
            return { host }
        },
        template: /* html */ `
			<div ref="host" data-testId="host" style="min-height: 160px">${light}</div>
		`,
    })
}

/**
 * The same keyboard with the dropdown in a shadow root, as inside a custom
 * element: there `document.activeElement` is the host, not the item.
 */
export const InShadowRoot: Story = {
    args: {
        ...defaultArgs,
    },
    render: args => renderInShadowRoot(keyboardTemplate, () => ({ args }))(),
    play: shadowRootTest,
}

const enterTemplate = /* html */ `
	<vv-dropdown v-bind="args">
		<vv-button data-testId="trigger" label="Toggle dropdown" />
		<template #items>
			<vv-dropdown-action @click="actions++">Action</vv-dropdown-action>
			<vv-dropdown-option @click="options++">Option</vv-dropdown-option>
		</template>
	</vv-dropdown>
	<output data-testId="count">{{ actions }} {{ options }}</output>
`

/**
 * Enter and Space run the focused item once: the action, a button the browser
 * activates by itself, and the option, which the dropdown clicks.
 */
export const EnterOnItem: Story = {
    args: {
        ...defaultArgs,
    },
    render: args => ({
        components: { VvDropdown, VvDropdownAction, VvDropdownOption, VvButton },
        setup() {
            return { args, actions: ref(0), options: ref(0) }
        },
        template: /* html */ `
			<div style="min-height: 160px">${enterTemplate}</div>
		`,
    }),
    play: enterOnItemTest,
}

/**
 * The same keys in a shadow root, where the target of the key is the host
 * and the dropdown clicked it instead of the option.
 */
export const EnterOnItemInShadowRoot: Story = {
    args: {
        ...defaultArgs,
    },
    render: args =>
        renderInShadowRoot(enterTemplate, () => ({
            args,
            actions: ref(0),
            options: ref(0),
        }))(),
    play: enterOnItemInShadowRootTest,
}

const actionClickTemplate = /* html */ `
	<div style="min-height: 160px">
		<vv-dropdown v-bind="args">
			<vv-button data-testId="trigger" label="Toggle dropdown" />
			<template #items>
				<vv-dropdown-action @click="actions++">Action</vv-dropdown-action>
				<vv-dropdown-action>Other action</vv-dropdown-action>
			</template>
		</vv-dropdown>
		<output data-testId="count">{{ actions }}</output>
	</div>
`

/**
 * A click on an action closes the dropdown and gives the focus back to the
 * trigger, without a `hide` in the handler: the dropdown stayed open over
 * what the action had opened.
 */
export const ActionClick: Story = {
    args: {
        ...defaultArgs,
    },
    render: args => ({
        components: { VvDropdown, VvDropdownAction, VvButton },
        setup() {
            return { args, actions: ref(0) }
        },
        template: actionClickTemplate,
    }),
    play: actionClickTest(false),
}

/**
 * With `keepOpen` a click on an action leaves the dropdown open, as a click
 * outside it does.
 */
export const ActionClickKeepOpen: Story = {
    ...ActionClick,
    args: {
        ...defaultArgs,
        keepOpen: true,
    },
    play: actionClickTest(true),
}

/**
 * A reference that wraps its trigger with a hidden input before it, as a
 * form field does: Escape gives the focus to the trigger, not to the input.
 */
export const WrapperReference: Story = {
    args: {
        ...defaultArgs,
    },
    render: args => ({
        components: { VvDropdown, VvDropdownAction, VvButton },
        setup() {
            const wrapper = ref<HTMLElement>()
            const expanded = ref(false)
            return { args, wrapper, expanded }
        },
        template: /* html */ `
			<div style="min-height: 160px">
				<div ref="wrapper" class="inline-flex">
					<input type="hidden" name="choice" value="">
					<vv-button data-testId="trigger" label="Toggle dropdown" @click="expanded = !expanded" />
				</div>
				<vv-dropdown v-model="expanded" v-bind="args" :reference="wrapper">
					<template #items>
						<vv-dropdown-action>Create</vv-dropdown-action>
						<vv-dropdown-action>Update</vv-dropdown-action>
					</template>
				</vv-dropdown>
			</div>
		`,
    }),
    play: wrapperReferenceTest,
}

// a button after the dropdown, where `Tab` past the items takes the focus,
// and the values the dropdown gives its model; `after` goes after the items
function tabOutTemplate(after = '') {
    return /* html */ `
		<div style="min-height: 160px">
			<vv-dropdown v-model="expanded" v-bind="args" @update:model-value="changes.push($event)">
				<vv-button data-testId="trigger" label="Toggle dropdown" />
				<template #items>
					<vv-dropdown-action>Create</vv-dropdown-action>
					<vv-dropdown-action>Update</vv-dropdown-action>
					<vv-dropdown-action>Delete</vv-dropdown-action>
					${after}
				</template>
			</vv-dropdown>
			<vv-button data-testId="next" label="Next" />
			<output data-testId="changes">{{ changes.join(' ') }}</output>
		</div>
	`
}

/**
 * `Tab` past the last item closes the dropdown and leaves the focus on the
 * button after it: the dropdown stayed open over that button.
 */
export const TabOut: Story = {
    args: {
        ...defaultArgs,
    },
    render: args => ({
        components: { VvDropdown, VvDropdownAction, VvButton },
        setup() {
            return { args, expanded: ref(false), changes: ref<boolean[]>([]) }
        },
        template: tabOutTemplate(),
    }),
    play: tabOutTest(),
}

/**
 * The same in the top layer, where the dropdown is still in the document
 * after its trigger.
 */
export const TabOutTopLayer: Story = {
    ...TabOut,
    args: {
        ...defaultArgs,
        topLayer: true,
    },
    play: tabOutTest({ topLayer: true }),
}

/**
 * With `keepOpen` the dropdown stays open when `Tab` takes the focus out of
 * it, as on a click outside.
 */
export const TabOutKeepOpen: Story = {
    ...TabOut,
    args: {
        ...defaultArgs,
        keepOpen: true,
    },
    play: tabOutTest({ keepOpen: true }),
}

/**
 * `Shift+Tab` from the first item closes the dropdown and leaves the focus on
 * the trigger.
 */
export const ShiftTabOut: Story = {
    ...TabOut,
    play: shiftTabOutTest,
}

/**
 * A click on the trigger with the focus in the dropdown closes it once: the
 * press moves the focus to the trigger before the click that toggles the
 * dropdown.
 */
export const TriggerClickWhileOpen: Story = {
    ...TabOut,
    play: triggerClickWhileOpenTest,
}

/**
 * `Tab` and `Shift+Tab` out of a dropdown in a shadow root, as inside a
 * custom element, with a button of the page assigned to a `<slot>` after the
 * items.
 */
export const TabOutInShadowRoot: Story = {
    args: {
        ...defaultArgs,
    },
    render: args =>
        renderInShadowRoot(
            // `component` renders the element: a `<slot>` is Vue's own
            tabOutTemplate('<component is="slot" name="extra" />'),
            () => ({
                args,
                expanded: ref(false),
                changes: ref<boolean[]>([]),
            }),
            '<button type="button" slot="extra" role="menuitem" data-testId="slotted">Slotted</button>',
        )(),
    play: tabOutInShadowRootTest,
}
