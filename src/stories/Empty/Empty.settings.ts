import type { ArgTypes } from '@storybook/vue3-vite'
import { DefaultSlotArgTypes, IconArgTypes, ModifiersArgTypes } from '@/stories/argTypes'

export const defaultArgs = {
    title: 'No messages yet',
    description: 'When someone writes to you, the conversation shows up here.',
    icon: 'email',
    titleTag: 'p',
}

export const argTypes: ArgTypes = {
    ...ModifiersArgTypes,
    ...DefaultSlotArgTypes,
    icon: IconArgTypes.icon,
    title: {
        description: 'Title, what is missing',
        control: {
            type: 'text',
        },
    },
    description: {
        description: 'What the empty state has to say under the title',
        control: {
            type: 'text',
        },
    },
    titleTag: {
        description:
			'Tag of the title: a heading when the empty state stands for a whole page or section',
        control: 'radio',
        options: ['p', 'h2', 'h3', 'h4'],
    },
    media: {
        description: 'Media, an icon or an illustration, in place of the `icon` prop',
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
}
