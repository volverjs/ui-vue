import { VvAvatarProps } from '@/components/VvAvatar'
import { DefaultSlotArgTypes, ModifiersArgTypes } from '@/stories/argTypes'

export const defaultArgs = {
	...propsToObject(VvAvatarProps),
    imgSrc: "https://i.pravatar.cc/300"
}

export const argTypes = {
    ...DefaultSlotArgTypes,
    default: {
		description: 'Content slot',
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
    modifiers: {
		...ModifiersArgTypes.modifiers,
		options: [
			'md',
			'lg',
            'rounded',
            'square',
            'circle',
			'brand'
		],
	},
    imgSrc: {
        type: {
			summary: 'string',
		},
        control: {
            type: 'text',
        },
        description: 'The image url'
    }
}