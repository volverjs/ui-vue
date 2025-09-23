import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvInputText from '@/components/VvInputText/VvInputText.vue'
import { argTypes, defaultArgs } from './InputText.settings'
import { Default } from './InputText.stories'

const meta: Meta<typeof VvInputText> = {
    title: 'Components/InputText/Length',
    component: VvInputText,
    args: defaultArgs,
    argTypes,
}

export default meta

type Story = StoryObj<typeof VvInputText>

export const MaxLength: Story = {
    ...Default,
    args: {
        ...Default.args,
        maxlength: 5,
    },
}

export const MinLength: Story = {
    ...Default,
    args: {
        ...Default.args,
        minlength: 5,
    },
}

export const Count: Story = {
    ...Default,
    args: {
        ...Default.args,
        count: true,
        minlength: 100,
    },
}

export const Limit: Story = {
    ...Default,
    args: {
        ...Default.args,
        count: 'limit',
        maxlength: 100,
    },
}

export const Countdown: Story = {
    ...Default,
    args: {
        ...Default.args,
        count: 'countdown',
        maxlength: 100,
    },
}
