import { VvAvatarProps } from '@/components/VvAvatar'
import { DefaultSlotArgTypes, ModifiersArgTypes } from '@/stories/argTypes'

export const defaultArgs = {
	...propsToObject(VvAvatarProps),
    rounded: true,
    imgSrc: "https://i.pravatar.cc/300",
    size: "md",
    cssClass: "bg-brand",
}

export const argTypes = {
    ...ModifiersArgTypes,
    ...DefaultSlotArgTypes,
    rounded: {
        type: {
			summary: 'boolean',
		},
        control: {
            type: 'boolean',
        },
        table: {
			defaultValue: { summary: 'true' },
		},
        description: 'Indicates if avatar is rounded or not'
    },
    imgSrc: {
        type: {
			summary: 'string',
		},
        control: {
            type: 'text',
        },
        description: 'The image url'
    },
    cssClass: {
        type: {
			summary: 'string',
		},
        control: {
            type: 'text',
        },
        description: 'CSS classes'
    },
    color: {
        type: {
			summary: 'string',
		},
        control: {
            type: 'text',
        },
        description: 'Avatar color if "imgSrc" not exist'
    },
    size: {
        type: {
			summary: 'string',
		},
        control: {
            type: 'select',
        },
        description: 'The tooltip size',
        options: [undefined, 'md', 'lg']
    }
}