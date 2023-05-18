import { IconArgTypes } from '../argTypes'
import { ModifiersArgTypes } from '../argTypes'

export const defaultArgs = {
	title: 'Alert title!',
	content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
	dismissable: false,
	autoClose: 0,
	role: 'alert',
}

export const argTypes = {
	title: {
		description: 'The alert title',
	},
	content: {
		description: 'The alert content',
	},
	dismissable: {
		description: 'Dismissable by clicking on the close button',
		control: 'boolean',
		table: {
			defaultValue: {
				summary: false,
			},
		},
	},
	autoClose: {
		description: 'Auto close after the specified time in milliseconds',
		control: 'number',
		table: {
			defaultValue: {
				summary: 0,
			},
		},
	},
	modifiers: {
		...ModifiersArgTypes.modifiers,
		options: [
			'success',
			'warning',
			'danger',
			'info',
			'brand',
			'notification',
			'accent',
			'callout',
		],
	},
	icon: IconArgTypes.icon,
	role: {
		description: 'The alert role',
		control: 'radio',
		options: ['alert', 'alertdialog'],
		table: {
			defaultValue: 'alert',
		},
	},
	// slots
	header: {
		control: {
			type: 'text',
		},
		table: {
			type: {
				summary: 'html',
			},
		},
	},
	'title::before': {
		control: {
			type: 'text',
		},
		table: {
			type: {
				summary: 'html',
			},
		},
	},
	'title::after': {
		control: {
			type: 'text',
		},
		table: {
			type: {
				summary: 'html',
			},
		},
	},
	close: {
		control: {
			type: 'text',
		},
		table: {
			type: {
				summary: 'html',
			},
		},
	},
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
	footer: {
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
