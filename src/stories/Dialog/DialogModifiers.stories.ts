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
