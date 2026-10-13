import type { ArgTypes } from '@storybook/vue3-vite'
import { DefaultSlotArgTypes, ModifiersArgTypes } from '@/stories/argTypes'

export const defaultArgs = {
    label: undefined,
    vertical: false,
}

export const argTypes: ArgTypes = {
    ...ModifiersArgTypes,
    ...DefaultSlotArgTypes,
    label: {
        description: 'Text on the line, such as "or" or a date',
        control: {
            type: 'text',
        },
    },
    vertical: {
        description: 'Stand the line up between two items of a row',
        control: {
            type: 'boolean',
        },
    },
}
