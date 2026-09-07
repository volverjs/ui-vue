import type { ArgTypes } from '@storybook/vue3-vite'
import { VvInputRangeProps } from '@/components/VvInputRange'
import {
    AutofocusArgTypes,
    DebounceArgTypes,
    DisabledArgTypes,
    HintArgTypes,
    IdNameArgTypes,
    InvalidArgTypes,
    LoadingArgTypes,
    ModifiersArgTypes,
    ReadonlyArgTypes,
    TabindexArgTypes,
    ValidArgTypes,
} from '@/stories/argTypes'

export const defaultArgs = {
    ...propsToObject(VvInputRangeProps),
    name: 'vv-input-range',
    label: 'Range label',
    step: 1,
}

export const argTypes: ArgTypes = {
    ...IdNameArgTypes,
    ...AutofocusArgTypes,
    ...TabindexArgTypes,
    ...DisabledArgTypes,
    ...ReadonlyArgTypes,
    ...ValidArgTypes,
    ...InvalidArgTypes,
    ...HintArgTypes,
    ...LoadingArgTypes,
    ...ModifiersArgTypes,
    ...DebounceArgTypes,
    label: {
        description: 'Input label',
        control: {
            type: 'text',
        },
    },
    min: {
        description: 'The most negative value the slider accepts.',
        control: {
            type: 'number',
        },
        table: {
            defaultValue: {
                summary: '0',
            },
        },
    },
    max: {
        description: 'The greatest value the slider accepts.',
        control: {
            type: 'number',
        },
        table: {
            defaultValue: {
                summary: '100',
            },
        },
    },
    step: {
        description: 'The granularity the value must adhere to.',
        control: {
            type: 'number',
        },
    },
    defaultValue: {
        description:
			'Value emitted on mount when the model is undefined. A range input has no empty state: without it the field shows the middle of its track while the form model stays empty.',
        control: {
            type: 'number',
        },
    },
    showValue: {
        description: 'Show the current value next to the slider.',
        table: {
            defaultValue: {
                summary: 'true',
            },
        },
    },
    unit: {
        description: 'Unit of measure shown next to the value.',
        control: {
            type: 'text',
        },
    },
    formatValue: {
        description:
			'Format the value shown next to the slider, e.g. to localize it.',
        control: false,
    },
}
