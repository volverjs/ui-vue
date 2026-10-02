import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvInputText from '@/components/VvInputText/VvInputText.vue'
import { argTypes, defaultArgs } from './InputText.settings'
import { Default } from './InputText.stories'
import { DATE_MAX, DATE_MIN, dateLimitsTest, defaultMaxTest, emptyLimitsTest } from './InputText.test'

const meta: Meta<typeof VvInputText> = {
    title: 'Components/InputText/MinMax',
    component: VvInputText,
    args: defaultArgs,
    argTypes,
}

export default meta

type Story = StoryObj<typeof VvInputText>

export const MinNumber: Story = {
    ...Default,
    args: {
        ...Default.args,
        type: 'number',
        min: -15,
    },
}

export const MaxNumber: Story = {
    ...Default,
    args: {
        ...Default.args,
        type: 'number',
        max: 15,
    },
}

export const MinDate: Story = {
    ...Default,
    args: {
        ...Default.args,
        type: 'date',
        min: new Date().toISOString().split('T')[0],
    },
}

export const MaxDate: Story = {
    ...Default,
    args: {
        ...Default.args,
        type: 'date',
        max: new Date().toISOString().split('T')[0],
    },
}

export const DefaultMaxDate: Story = {
    ...Default,
    args: {
        ...Default.args,
        type: 'date',
    },
    play: defaultMaxTest,
}

export const DefaultMaxDateTime: Story = {
    ...DefaultMaxDate,
    args: {
        ...Default.args,
        type: 'datetime-local',
    },
}

export const DefaultMaxMonth: Story = {
    ...DefaultMaxDate,
    args: {
        ...Default.args,
        type: 'month',
    },
}

export const DefaultMaxWeek: Story = {
    ...DefaultMaxDate,
    args: {
        ...Default.args,
        type: 'week',
    },
}

export const DateLimitsDate: Story = {
    ...Default,
    args: {
        ...Default.args,
        type: 'date',
        min: DATE_MIN,
        max: DATE_MAX,
    },
    play: dateLimitsTest,
}

export const DateLimitsDateTime: Story = {
    ...DateLimitsDate,
    args: {
        ...Default.args,
        type: 'datetime-local',
        step: 60,
        min: DATE_MIN.toISOString(),
        max: DATE_MAX.toISOString(),
    },
}

export const DateLimitsMonth: Story = {
    ...DateLimitsDate,
    args: {
        ...Default.args,
        type: 'month',
        min: DATE_MIN,
        max: DATE_MAX,
    },
}

export const DateLimitsTime: Story = {
    ...DateLimitsDate,
    args: {
        ...Default.args,
        type: 'time',
        min: DATE_MIN.toISOString(),
        max: DATE_MAX.toISOString(),
    },
}

export const DateLimitsTimeFractionalStep: Story = {
    ...DateLimitsDate,
    args: {
        ...Default.args,
        type: 'time',
        step: '0.5',
        min: DATE_MIN,
        max: DATE_MAX,
    },
}

export const EmptyLimits: Story = {
    ...Default,
    args: {
        ...Default.args,
        type: 'date',
        min: '',
        max: new Date(Number.NaN),
    },
    play: emptyLimitsTest,
}
