import {
	DefaultSlotArgTypes,
	DisabledArgTypes,
	ModifiersArgTypes
} from '@/stories/argTypes'

export const defaultArgs = {
	collapse: false,
	disabled: false,
	items: [
		{
			name: 'a-1',
			title: 'Details 1',
			content:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean turpis diam, tempor non sem ut, suscipit gravida mi.'
		},
		{
			name: 'a-2',
			title: 'Details 2',
			content:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean turpis diam, tempor non sem ut, suscipit gravida mi.'
		},
		{
			name: 'a-3',
			title: 'Details 3',
			content:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean turpis diam, tempor non sem ut, suscipit gravida mi.'
		}
	],
	modifiers: [],
	itemModifiers: []
}

export const argTypes = {
	'`details::${item.name}`': {
		table: {
			disable: true
		}
	},
	'`header::${item.name}`': {
		table: {
			disable: true
		}
	},
	modifiers: {
		...ModifiersArgTypes.modifiers,
		options: ['compact', 'bordered']
	},
	itemModifiers: {
		control: 'check',
		options: ['marker-right', 'bordered']
	},
	...DisabledArgTypes,
	...DefaultSlotArgTypes
}
