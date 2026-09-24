import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvNav from '@/components/VvNav/VvNav.vue'
import { argTypes, defaultArgs } from './Nav.settings'
import { defaultTest, keyboardTest } from './Nav.test'

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
