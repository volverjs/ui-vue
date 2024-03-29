import {
	DefaultSlotArgTypes,
	DisabledArgTypes,
	ModifiersArgTypes,
} from '@/stories/argTypes'

export const defaultArgs = {
	collapse: false,
	disabled: false,
	items: [
		{
			name: 'a-1',
			title: 'Details 1',
			content:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean turpis diam, tempor non sem ut, suscipit gravida mi.',
		},
		{
			name: 'a-2',
			title: 'Details 2',
			content:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean turpis diam, tempor non sem ut, suscipit gravida mi.',
		},
		{
			name: 'a-3',
			title: 'Details 3',
			content:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean turpis diam, tempor non sem ut, suscipit gravida mi.',
		},
	],
	modifiers: [],
	itemModifiers: [],
}

export const argTypes = {
	'`details::${item.name}`': {
		table: {
			disable: true,
		},
	},
	'`header::${item.name}`': {
		table: {
			disable: true,
		},
	},
	items: {
		description: 'Accordion group items',
	},
	collapse: {
		description: 'Enables accordion group collapse',
		control: 'boolean',
		table: {
			defaultValue: {
				summary: false,
			},
		},
	},
	not: {
		description: 'Inverts the accordion group state',
		control: 'boolean',
		table: {
			defaultValue: {
				summary: false,
			},
		},
	},
	modifiers: {
		...ModifiersArgTypes.modifiers,
		options: ['condensed'],
	},
	itemModifiers: {
		description: 'Accordion items BEM modifiers',
		control: 'check',
		options: ['marker-right', 'bordered', 'square'],
	},
	...DisabledArgTypes,
	...DefaultSlotArgTypes,
}
