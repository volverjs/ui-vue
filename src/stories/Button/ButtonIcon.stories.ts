import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvButton from '@/components/VvButton/VvButton.vue'
import { argTypes, defaultArgs } from './Button.settings'
import { Default } from './Button.stories'

const meta: Meta<typeof VvButton> = {
    title: 'Components/Button/Icon',
    component: VvButton,
    args: defaultArgs,
    argTypes,
}

export default meta

type Story = StoryObj<typeof VvButton>

export const Top: Story = {
    ...Default,
    args: {
        ...Default.args,
        icon: 'add',
        iconPosition: 'top',
        label: 'Button with top icon',
        modifiers: 'ghost',
    },
}

export const Right: Story = {
    ...Default,
    args: {
        ...Default.args,
        icon: 'add',
        iconPosition: 'right',
        label: 'Button with right icon',
    },
}

export const Bottom: Story = {
    ...Default,
    args: {
        ...Default.args,
        icon: 'add',
        iconPosition: 'bottom',
        label: 'Button with bottom icon',
        modifiers: 'ghost',
    },
}

export const Left: Story = {
    ...Default,
    args: {
        ...Default.args,
        icon: 'add',
        label: 'Button with left icon',
    },
}

export const NoLabel: Story = {
    ...Default,
    args: {
        ...Default.args,
        icon: 'add',
        label: '',
        ariaLabel: 'Add new item',
        modifiers: 'rounded',
    },
}
