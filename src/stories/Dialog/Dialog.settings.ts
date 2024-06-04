import { DefaultSlotArgTypes } from '@/stories/argTypes'
import type { ArgTypes } from '@storybook/vue3'

export const defaultArgs = {
	id: 'dialog',
	title: 'Dialog Title',
	transition: 'fade-block',
	size: 'standard',
	keepOpen: false,
	default: 'Default slot content',
}

export const argTypes: ArgTypes = {
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
