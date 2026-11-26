import type { Meta, StoryObj } from '@storybook/vue3-vite'
import VvInputText from '@/components/VvInputText/VvInputText.vue'
import { argTypes, defaultArgs } from './InputText.settings'
import {
    dateTimeClearTest,
    dateTimeEditTest,
    dateTimeRevertTest,
    isoTest,
    JANUARY_END,
    monthEndTest,
} from './InputText.test'

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

/**
 * A value with seconds and milliseconds, edited from the field: the new value
 * is the instant the field shows.
 */
export const TypeDateTimeEdit: Story = {
    args: {
        ...defaultArgs,
        type: 'datetime-local',
        step: 60,
    },
    render: args => ({
        components: { VvInputText },
        setup() {
            return { args }
        },
        data: () => ({
            inputValue: '2026-11-25T09:29:29.917Z',
        }),
        template: /* html */ `
			<vv-input-text v-bind="args" v-model="inputValue" data-testId="element" />
			<div>Value: <span data-testId="value">{{ inputValue }}</span></div>
		`,
    }),
    play: dateTimeEditTest,
}

/**
 * With a `debounce`, a value typed and then typed back to the one the field
 * showed leaves the model as it was.
 */
export const TypeDateTimeRevert: Story = {
    ...TypeDateTimeEdit,
    args: {
        ...TypeDateTimeEdit.args,
        debounce: 300,
    },
    play: dateTimeRevertTest,
}

/**
 * Emptied and then given back the value it showed, the field sets the model
 * to that value.
 */
export const TypeDateTimeClear: Story = {
    ...TypeDateTimeEdit,
    play: dateTimeClearTest,
}

/**
 * The same with a `Date` model, which the field empties to `undefined`.
 */
export const TypeDateTimeClearDate: Story = {
    ...TypeDateTimeClear,
    render: args => ({
        components: { VvInputText },
        setup() {
            return { args }
        },
        data: () => ({
            inputValue: new Date('2026-11-25T09:29:29.917Z') as Date | undefined,
        }),
        template: /* html */ `
			<vv-input-text v-bind="args" v-model="inputValue" data-testId="element" />
			<div>Value: <span data-testId="value">{{ inputValue instanceof Date ? inputValue.toISOString() : inputValue }}</span></div>
		`,
    }),
}

/**
 * The 31st of January moved to the 28th of February, in a date field.
 */
export const TypeDateMonthEnd: Story = {
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
            inputValue: JANUARY_END.toISOString(),
        }),
        template: /* html */ `
			<vv-input-text v-bind="args" v-model="inputValue" data-testId="element" />
			<div>Value: <span data-testId="value">{{ inputValue }}</span></div>
		`,
    }),
    play: monthEndTest,
}

/**
 * The 31st of January moved to February in a month field: the last day of
 * February.
 */
export const TypeMonthMonthEnd: Story = {
    ...TypeDateMonthEnd,
    args: {
        ...defaultArgs,
        type: 'month',
    },
}
