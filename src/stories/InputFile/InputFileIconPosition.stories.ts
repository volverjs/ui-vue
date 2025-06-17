import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvInputFile from '@/components/VvInputFile/VvInputFile.vue'
import { argTypes, defaultArgs } from './InputFile.settings'
import { Default } from './InputFile.stories'

const meta: Meta<typeof VvInputFile> = {
    title: 'Components/InputFile/Icon',
    component: VvInputFile,
    args: defaultArgs,
    argTypes,
}

export default meta

type Story = StoryObj<typeof VvInputFile>

export const DefaultPosition: Story = {
    ...Default,
    args: {
        ...Default.args,
        icon: 'heart',
    },
}

export const After: Story = {
    ...Default,
    args: {
        ...Default.args,
        icon: 'heart',
        iconPosition: 'after',
    },
}

export const Src: Story = {
    ...Default,
    args: {
        ...Default.args,
        icon: {
            name: 'engineering',
            src: 'https://raw.githubusercontent.com/google/material-design-icons/master/src/social/engineering/materialicons/24px.svg',
        },
    },
}
