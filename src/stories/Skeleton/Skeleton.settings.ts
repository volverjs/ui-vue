import type { ArgTypes } from '@storybook/vue3-vite'
import { ModifiersArgTypes } from '@/stories/argTypes'

export const defaultArgs = {
    loading: true,
    items: 3,
    itemClass: ['max-w-192', 'max-w-192', 'max-w-100'],
    label: 'Loading',
}

export const argTypes: ArgTypes = {
    ...ModifiersArgTypes,
    loading: {
        description:
			'Show the placeholder; when false the default slot, the content it stands for, takes its place',
        control: {
            type: 'boolean',
        },
    },
    items: {
        description: 'Number of bars',
        control: {
            type: 'number',
        },
    },
    itemClass: {
        description:
			'Class of the bars: a string for every bar, an array for one bar each',
        control: {
            type: 'object',
        },
    },
    label: {
        description: 'Accessible name, announced through `role="status"` while loading',
        control: {
            type: 'text',
        },
    },
}
