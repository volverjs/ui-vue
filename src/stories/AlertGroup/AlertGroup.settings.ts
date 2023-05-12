import { ModifiersArgTypes } from '../argTypes'

export const defaultArgs = {
	name: 'default',
	items: [
		{
			id: 1,
			title: 'Info!',
			content: 'This is an info message.',
			icon: 'information',
			modifiers: 'info',
		},
		{
			id: 2,
			title: 'Warning!',
			content: 'This is an warning message.',
			icon: 'warning',
			modifiers: 'warning',
		},
		{
			id: 3,
			title: 'Danger!',
			content: 'This is an danger message.',
			icon: 'error',
			modifiers: 'danger',
		},
	],
	stack: false,
	reverse: false,
}
export const argTypes = {
	name: {
		description: 'The alert group name',
	},
	items: {
		description: 'The alert group items',
		table: {
			defaultValue: {
				summary: '[]',
			},
		},
	},
	stack: {
		description: 'Stack alerts',
		table: {
			defaultValue: {
				summary: 'false',
			},
		},
	},
	reverse: {
		description: 'Reverse alerts',
		table: {
			defaultValue: {
				summary: 'false',
			},
		},
	},
	position: {
		description: 'The alert group position',
		control: 'radio',
		options: ['absolute', 'fixed'],
	},
	inline: {
		description: 'The alert group inline alignment',
		control: 'radio',
		options: ['start', 'middle', 'end'],
	},
	block: {
		description: 'The alert group block alignment',
		control: 'radio',
		options: ['top', 'center', 'bottom'],
	},
	transition: {
		description: 'The alert group transition',
		control: 'text',
	},
	...ModifiersArgTypes,
	// slots
	default: {
		control: {
			type: 'text',
		},
		table: {
			type: {
				summary: 'html',
			},
		},
	},
	before: {
		control: {
			type: 'text',
		},
		table: {
			type: {
				summary: 'html',
			},
		},
	},
	after: {
		control: {
			type: 'text',
		},
		table: {
			type: {
				summary: 'html',
			},
		},
	},
}
