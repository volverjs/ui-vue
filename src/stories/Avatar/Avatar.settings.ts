import { VvAvatarProps } from '@/components/VvAvatar'
import { DefaultSlotArgTypes } from '@/stories/argTypes'
import type { ArgTypes } from '@storybook/types'

export const defaultArgs = {
	...propsToObject(VvAvatarProps),
	imgSrc: 'https://i.pravatar.cc/300',
}

export const argTypes: ArgTypes = {
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
		description: 'Component BEM modifiers',
		control: {
			type: 'check',
		},
		options: ['rounded', 'square', 'bordered', 'ring', 'lg', 'md'],
	},
	imgSrc: {
		control: {
			type: 'text',
		},
		description: 'The image url',
	},
}
