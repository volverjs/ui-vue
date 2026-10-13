import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvDialog from '@/components/VvDialog/VvDialog.vue'
import { argTypes, defaultArgs } from './Dialog.settings'
import { Default } from './Dialog.stories'

const meta: Meta<typeof VvDialog> = {
    title: 'Components/Dialog/Modifiers',
    component: VvDialog,
    args: defaultArgs,
    argTypes,
}

export default meta

type Story = StoryObj<typeof VvDialog>

export const Standard: Story = {
    ...Default,
    args: {
        ...Default.args,
        title: 'Standard',
        modifiers: 'standard',
    },
}

export const Small: Story = {
    ...Default,
    args: {
        ...Default.args,
        title: 'Small',
        modifiers: 'small',
    },
}

export const Fullscreen: Story = {
    ...Default,
    args: {
        ...Default.args,
        title: 'Fullscreen',
        modifiers: 'fullscreen',
    },
}

/**
 * A drawer on the inline end, paired with the slide from its side.
 */
export const Drawer: Story = {
    ...Default,
    args: {
        ...Default.args,
        title: 'Drawer',
        modifiers: 'drawer',
        transition: 'slide-inline-end',
    },
}

/**
 * A drawer on the inline start, paired with the slide from its side.
 */
export const DrawerStart: Story = {
    ...Default,
    args: {
        ...Default.args,
        title: 'Drawer start',
        modifiers: 'drawer-start',
        transition: 'slide-inline-start',
    },
}

/**
 * A drawer on the top edge, paired with the slide from its side.
 */
export const DrawerTop: Story = {
    ...Default,
    args: {
        ...Default.args,
        title: 'Drawer top',
        modifiers: 'drawer-top',
        transition: 'slide-block-start',
    },
}

/**
 * A drawer on the bottom edge, the bottom sheet of a phone, paired with the
 * slide from its side.
 */
export const DrawerBottom: Story = {
    ...Default,
    args: {
        ...Default.args,
        title: 'Drawer bottom',
        modifiers: 'drawer-bottom',
        transition: 'slide-block-end',
    },
}
