import {
	DefaultSlotArgTypes,
	DisabledArgTypes,
	ModifiersArgTypes,
} from '@/stories/argTypes'

export const defaultArgs = {
	title: 'Lorem Ipsum',
	content:
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean turpis diam, tempor non sem ut, suscipit gravida mi.',
	modifiers: [],
	disabled: false,
}

export const argTypes = {
	summary: {
		description: 'The title slot',
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
	details: {
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
	modifiers: {
		...ModifiersArgTypes.modifiers,
		options: ['marker-right', 'bordered'],
	},
	...DisabledArgTypes,
	...DefaultSlotArgTypes,
}
