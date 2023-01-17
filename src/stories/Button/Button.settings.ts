import {
	DefaultSlotArgTypes,
	ModifiersArgTypes,
	DisabledArgTypes,
	LoadingArgTypes,
} from '@/stories/argTypes'
import normal from '@/assets/icons/normal.json'

export const defaultArgs = {
	label: 'Button',
	type: 'button',
	toggle: false,
	unselectable: true,
	loading: false,
	pressed: false,
	active: false,
	disabled: false,
	rel: 'noopener noreferrer',
	iconPosition: 'left',
	icon: undefined,
}

export const argTypes = {
	modifiers: {
		...ModifiersArgTypes.modifiers,
		options: [
			'primary',
			'secondary',
			'danger',
			'ghost',
			'link',
			'action',
			'action-quiet',
			'static-light',
			'static-dark',
			'full-bleed',
			'block',
			'rounded',
		],
	},
	icon: {
		options: ['', ...Object.keys(normal.icons)],
		control: {
			type: 'select',
		},
	},
	iconPosition: {
		options: ['left', 'right', 'top', 'bottom'],
		control: {
			type: 'radio',
		},
		table: {
			defaultValue: { summary: 'left' },
		},
	},
	label: {
		table: {
			category: '',
			type: '',
		},
		description: 'The label of the button',
		control: { type: 'text' },
	},
	toggle: {
		description: 'Whether the button is toggleable',
		control: { type: 'boolean' },
		table: {
			defaultValue: { summary: false },
		},
	},
	unselectable: {
		description: 'Whether the button is unselectable',
		control: { type: 'boolean' },
		table: {
			defaultValue: { summary: true },
		},
	},
	...LoadingArgTypes,
	...DisabledArgTypes,
	pressed: {
		description: 'Whether the button is pressed',
		control: { type: 'boolean' },
		table: {
			defaultValue: { summary: false },
		},
	},
	active: {
		description: 'Whether the button is active',
		control: { type: 'boolean' },
		table: {
			defaultValue: { summary: false },
		},
	},
	rel: {
		description: 'The rel attribute of the button',
		control: { type: 'text' },
		table: {
			defaultValue: { summary: 'noopener noreferrer' },
		},
	},
	type: {
		options: ['button', 'submit', 'reset'],
		control: {
			type: 'radio',
		},
		table: {
			defaultValue: { summary: 'button' },
		},
	},
	href: {
		description: 'The href attribute',
		control: { type: 'text' },
	},
	target: {
		options: ['', '_blank', '_self', '_parent', '_top'],
		description: 'The target attribute',
		control: {
			type: 'select',
		},
	},
	to: {
		description: 'The router link / nuxt link settings',
		control: { type: 'object' },
	},
	...DefaultSlotArgTypes,
	before: {
		description: 'Before label slot',
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
	after: {
		description: 'After label slot',
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
