import type { Meta, StoryObj } from '@storybook/vue3'
import VvInputText from '@/components/VvInputText/VvInputText.vue'
import { argTypes, defaultArgs } from './InputText.settings'
import { isoTest } from './InputText.test'

const meta: Meta<typeof VvInputText> = {
    title: 'Components/InputText/Iso',
    component: VvInputText,
    args: defaultArgs,
    argTypes,
}

export default meta

type Story = StoryObj<typeof VvInputText>

export const TypeDate: Story = {
    args: {
        ...defaultArgs,
        type: 'date',
    },
    render: args => ({
        components: { VvInputText },
        setup() {
            return { args }
        },
        data: () => ({
            inputValue: `2024-12-31T23:00:00.000Z`,
        }),
        template: /* html */ `
			<vv-input-text v-bind="args" v-model="inputValue" :data-testData="inputValue" data-testId="element" />
			<div>Value: <span data-testId="value">{{ inputValue }}</span></div>
		`,
    }),
    play: isoTest,
}

export const TypeTime: Story = {
    ...TypeDate,
    args: {
        ...defaultArgs,
        type: 'time',
    },
}

export const TypeTimeMinute: Story = {
    ...TypeDate,
    args: {
        ...defaultArgs,
        type: 'time',
        step: 60,
    },
}

export const TypeMonth: Story = {
    ...TypeDate,
    args: {
        ...defaultArgs,
        type: 'month',
    },
}

export const TypeDateTime: Story = {
    ...TypeDate,
    args: {
        ...defaultArgs,
        type: 'datetime-local',
    },
}
