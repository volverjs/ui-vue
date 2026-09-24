import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvDialog from '@/components/VvDialog/VvDialog.vue'
import { argTypes, defaultArgs } from './Dialog.settings'
import { Default as DefaultStory } from './Dialog.stories'

const meta: Meta<typeof VvDialog> = {
    title: 'Components/Dialog/Slots',
    component: VvDialog,
    args: defaultArgs,
    argTypes,
}

export default meta

type Story = StoryObj<typeof VvDialog>

export const Default: Story = {
    ...DefaultStory,
    args: {
        ...defaultArgs,
        default: 'DefaultStory <em class="italic">slot!</em>',
    },
}

/**
 * The header slot replaces the title, which named the dialog, so the dialog
 * points at the header it draws instead.
 */
export const HeaderSlot: Story = {
    ...DefaultStory,
    args: {
        ...defaultArgs,
        'header': '<span id="dialog-header">Header <em class="italic">slot!</em></span>',
        // an attribute and not a prop: it falls through to the <dialog>
        'aria-labelledby': 'dialog-header',
    } as Story['args'],
}

export const FooterSlot: Story = {
    ...DefaultStory,
    args: {
        ...defaultArgs,
        footer: 'Footer <em class="italic">slot!</em>',
    },
}
