import { DisabledArgTypes, ModifiersArgTypes } from '@/stories/argTypes'

export const defaultArgs = {
	title: 'Lorem Ipsum',
	content:
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean turpis diam, tempor non sem ut, suscipit gravida mi.',
	modifiers: [],
	disabled: false,
	not: false,
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
	default: {
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
	title: {
		description: 'The accordion title',
	},
	content: {
		description: 'The accordion content',
	},
	modifiers: {
		...ModifiersArgTypes.modifiers,
		options: ['marker-right', 'bordered'],
	},
	not: {
		description: 'Inverts the accordion state',
		control: 'boolean',
		table: {
			defaultValue: {
				summary: false,
			},
		},
	},
	...DisabledArgTypes,
}
