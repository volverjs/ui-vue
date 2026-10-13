import type { ArgTypes } from '@storybook/vue3-vite'
import { DefaultSlotArgTypes, ModifiersArgTypes } from '@/stories/argTypes'

export const defaultArgs = {
    keys: 'Esc',
    separator: '+',
}

export const argTypes: ArgTypes = {
    ...ModifiersArgTypes,
    ...DefaultSlotArgTypes,
    keys: {
        description: 'The key, or the keys of a combination',
        control: {
            type: 'object',
        },
    },
    separator: {
        description:
			'What joins the keys of a combination, written between them: empty for none',
        control: {
            type: 'text',
        },
    },
}
