import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvNav from '@/components/VvNav/VvNav.vue'
import VvNavItem from '@/components/VvNav/VvNavItem.vue'
import { argTypes, defaultArgs } from './Nav.settings'
import { defaultTest, keyboardTest, wheelTest } from './Nav.test'

const meta: Meta<typeof VvNav> = {
    title: 'Components/Nav',
    component: VvNav,
    args: defaultArgs,
    argTypes,
    tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof VvNav>

export const Default: Story = {
    args: {
        ...defaultArgs,
    },
    render: args => ({
        components: { VvNav },
        setup() {
            return { args }
        },
        template: /* html */ `
			<div class="m-md w-1/2">
				<vv-nav v-bind="args" data-testId="element" />
			</div>`,
    }),
    play: defaultTest,
}

/**
 * Items picked from the keyboard, which reach the same `click` event as the
 * pointer: the items are links and buttons.
 */
export const Keyboard: Story = {
    ...Default,
    render: args => ({
        components: { VvNav },
        setup() {
            const picked = ref<string>()
            return { args, picked }
        },
        template: /* html */ `
			<div class="m-md w-1/2">
				<vv-nav v-bind="args" data-testId="element" @click="picked = $event.label" />
				<div>Picked: <span data-testId="picked">{{ picked }}</span></div>
			</div>`,
    }),
    play: keyboardTest,
}

/**
 * Tabs wider than their box, scrolled with a mouse wheel. The menu of the
 * `tabs` modifier scrolls only sideways and hides its scrollbar, and a wheel
 * turns on the vertical axis: a vertical turn over the menu scrolls it
 * sideways, until the end it heads to. A list inside the menu that scrolls
 * vertically keeps the wheel until its own end.
 */
export const Wheel: Story = {
    args: {
        ...defaultArgs,
        items: Array.from({ length: 8 }, (_, index) => ({
            label: `Item ${index + 1}`,
        })),
    },
    render: args => ({
        components: { VvNav, VvNavItem },
        setup() {
            return { args }
        },
        template: /* html */ `
			<div class="m-md flex flex-col gap-md" style="width: 200px">
				<vv-nav :items="args.items" modifiers="tabs" aria-label="Tabs" data-testId="tabs" />
				<div dir="rtl">
					<vv-nav :items="args.items" modifiers="tabs" aria-label="Right to left" data-testId="tabs-rtl" />
				</div>
				<vv-nav :items="args.items.slice(0, 2)" modifiers="sidebar" aria-label="Sidebar" data-testId="sidebar" />
				<vv-nav modifiers="tabs" aria-label="With notes" data-testId="tabs-nested">
					<li role="presentation">
						<div role="group" aria-label="Notes" tabindex="0" class="text-14" style="width: 120px; height: 2lh; overflow-y: auto" data-testId="notes">
							<p v-for="index in 6" :key="index">Note {{ index }}</p>
						</div>
					</li>
					<vv-nav-item v-for="item in args.items" :key="item.label">{{ item.label }}</vv-nav-item>
				</vv-nav>
			</div>`,
    }),
    play: wheelTest,
}
