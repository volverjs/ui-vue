import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvCombobox from '@/components/VvCombobox/VvCombobox.vue'
import { argTypes, defaultArgs } from './Combobox.settings'
import { Default } from './Combobox.stories'

const meta: Meta<typeof VvCombobox> = {
    title: 'Components/Combobox/Multiple',
    // @ts-expect-error missing generic components support
    component: VvCombobox,
    args: defaultArgs,
    argTypes,
}

export default meta

type Story = StoryObj<typeof VvCombobox>

export const DefaultMultiple: Story = {
    ...Default,
    args: {
        ...Default.args,
        multiple: true,
    },
}

export const MinValues: Story = {
    ...Default,
    args: {
        ...Default.args,
        multiple: true,
        minValues: 2,
    },
}

export const MaxValues: Story = {
    ...Default,
    args: {
        ...Default.args,
        multiple: true,
        maxValues: 2,
    },
}

export const Separator: Story = {
    ...Default,
    args: {
        ...Default.args,
        multiple: true,
        separator: ' | ',
    },
}
