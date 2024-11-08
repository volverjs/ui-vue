import type { ArgTypes } from '@storybook/vue3'
import { VvButtonGroupProps } from '@/components/VvButtonGroup'
import {
    DefaultSlotArgTypes,
    ModifiersArgTypes,
    UnselectableArgTypes,
} from '@/stories/argTypes'
import { argTypes as buttonArgTypes } from '../Button/Button.settings'

export const defaultArgs = {
    ...propsToObject(VvButtonGroupProps),
    modifiers: [],
}

export const argTypes: ArgTypes = {
    modelValue: {
        table: {
            disable: true,
        },
    },
    modifiers: {
        ...ModifiersArgTypes.modifiers,
        options: ['compact', 'vertical', 'block'],
    },
    itemModifiers: {
        options: buttonArgTypes.modifiers.options,
        control: {
            type: 'check',
        },
    },
    legend: {
        control: {
            type: 'text',
            table: {
                category: 'Slots',
            },
        },
    },
    ...UnselectableArgTypes,
    ...DefaultSlotArgTypes,
}
