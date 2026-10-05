import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvInputText from '@/components/VvInputText/VvInputText.vue'
import { recordWarnings } from '@/test/warnings'
import { argTypes, defaultArgs } from './InputText.settings'
import { Default } from './InputText.stories'
import { invalidIconPositionTest } from './InputText.test'

const meta: Meta<typeof VvInputText> = {
    title: 'Components/InputText/Icon',
    component: VvInputText,
    args: defaultArgs,
    argTypes,
}

export default meta

type Story = StoryObj<typeof VvInputText>

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

/**
 * `left` is a side of VvButton, not a position in a field: the validator
 * warns, and the field draws no icon, since only `before` and `after` place one.
 */
export const InvalidPosition: Story = {
    ...Default,
    args: {
        ...Default.args,
        icon: 'heart',
        // @ts-expect-error a side of VvButton, which a field does not take
        iconPosition: 'left',
    },
    beforeEach: recordWarnings,
    play: invalidIconPositionTest,
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
