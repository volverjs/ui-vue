import type { ArgTypes } from '@storybook/vue3-vite'
import { DefaultSlotArgTypes, IconArgTypes, ModifiersArgTypes } from '@/stories/argTypes'

export const defaultArgs = {
    label: 'Maria joined the conversation',
}

export const argTypes: ArgTypes = {
    ...ModifiersArgTypes,
    ...DefaultSlotArgTypes,
    icon: IconArgTypes.icon,
    label: {
        description: 'Text of the note',
        control: {
            type: 'text',
        },
    },
}
