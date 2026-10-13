import type { ArgTypes } from '@storybook/vue3-vite'
import { ModifiersArgTypes } from '@/stories/argTypes'

export const defaultArgs = {
    label: 'Loading',
    decorative: false,
}

export const argTypes: ArgTypes = {
    ...ModifiersArgTypes,
    label: {
        description:
			'Accessible name, announced through `role="status"` while the spinner stands alone',
        control: {
            type: 'text',
        },
    },
    decorative: {
        description:
			'Hide the spinner from assistive technologies, when a visible text next to it already says what is happening',
        control: {
            type: 'boolean',
        },
    },
}
