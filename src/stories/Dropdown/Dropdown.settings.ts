import { DROPDOWN_ROLES, VvDropdownProps } from '@/components/VvDropdown'
import { DropdownArgTypes } from '../argTypes'

export const defaultArgs = {
	...propsToObject(VvDropdownProps),
}

export const argTypes = {
	...DropdownArgTypes,
	role: {
		description: 'Dropdown role',
		options: DROPDOWN_ROLES,
		control: {
			type: 'select',
		},
		table: {
			defaultValue: { summary: 'menu' },
		},
	},
	default: {
		description: 'The trigger slot',
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
	items: {
		description: 'The dropdown items slot',
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
	before: {
		description: 'The dropdown before slot',
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
		description: 'The dropdown after slot',
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
