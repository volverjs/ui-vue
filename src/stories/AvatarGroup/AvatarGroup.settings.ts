import { VvAvatarGroupProps } from '@/components/VvAvatarGroup'
import { DefaultSlotArgTypes, ModifiersArgTypes } from '@/stories/argTypes'

export const defaultArgs = {
	...propsToObject(VvAvatarGroupProps),
	items: [
		{
			text: 'MR',
			imgSrc: 'https://i.pravatar.cc/300',
			modifiers: 'rounded',
		},
		{
			imgSrc: 'https://i.pravatar.cc/300',
			modifiers: 'rounded',
		},
		{
			imgSrc: 'https://i.pravatar.cc/300',
			modifiers: 'rounded',
		},
		{
			imgSrc: 'https://i.pravatar.cc/300',
			modifiers: 'rounded',
		},
	],
	avatarModifiers: 'rounded',
}

export const argTypes = {
	...DefaultSlotArgTypes,
	default: {
		description: 'Default slot',
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
		options: ['tight', 'relaxed'],
	},
	avatarModifiers: {
		...ModifiersArgTypes.modifiers,
		options: ['rounded', 'square', 'bordered', 'ring', 'lg', 'md'],
	},
	toShow: {
		control: {
			type: 'number',
		},
	},
	totalItems: {
		control: {
			type: 'number',
		},
	},
}
