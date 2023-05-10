import { DefaultSlotArgTypes } from '@/stories/argTypes'

export const defaultArgs = {
	id: 'dialog',
	title: 'Dialog Title',
	transition: 'fade-block',
	size: 'standard',
	keepOpen: false,
	default: 'Default slot content',
}

export const argTypes = {
	title: { control: 'text' },
	transition: {
		control: 'radio',
		options: ['fade-block', 'fade-inline', 'scale'],
	},
	size: {
		control: 'radio',
		options: ['standard', 'small', 'fullscreen'],
	},
	...DefaultSlotArgTypes,
	header: {
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
	footer: {
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
