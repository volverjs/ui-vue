import { DefaultSlotArgTypes, ModifiersArgTypes } from '@/stories/argTypes'

export const defaultArgs = {
	title: 'Card title',
	content:
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean turpis diam, tempor non sem ut, suscipit gravida mi.',
}

export const argTypes = {
	modifiers: {
		...ModifiersArgTypes.modifiers,
		options: ['glass'],
	},
	title: {
		description: 'The title of the card',
		control: { type: 'text' },
	},
	...DefaultSlotArgTypes,
	header: {
		description: 'The header slot',
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
	content: {
		description: 'The content slot',
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
		description: 'The footer slot',
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
