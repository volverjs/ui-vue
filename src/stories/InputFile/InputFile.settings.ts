import type { ArgTypes } from '@storybook/vue3-vite'
import { VvInputFileProps } from '@/components/VvInputFile'
import { HintArgTypes, ModifiersArgTypes } from '@/stories/argTypes'

export const defaultArgs = {
    ...propsToObject(VvInputFileProps),
    name: 'vv-input-file',
    label: 'Upload file',
}

export const argTypes: ArgTypes = {
    ...HintArgTypes,
    'modifiers': {
        ...ModifiersArgTypes.modifiers,
        options: ['hidden', 'square', 'circle'],
    },
    'drop-area': {
        description: 'Drop area slot',
        control: {
            type: 'text',
        },
        table: {
            category: 'Slots',
            type: {
                summary: 'html',
            },
        },
    },
    'update:model-value': {
        table: {
            category: 'Events',
            type: {
                summary: 'File | File[]',
            },
        },
    },
}
