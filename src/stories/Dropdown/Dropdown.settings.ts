import {
	VvDropdownProps,
	DROPDOWN_PLACEMENTS,
	DROPDOWN_ROLES,
} from '@/components/VvDropdown'
import { propsToObject } from '@/utils/ObjectUtilities'

export const defaultArgs = {
	...propsToObject(VvDropdownProps),
}

export const argTypes = {
	placement: {
		description: 'Dropdown placement',
		options: DROPDOWN_PLACEMENTS,
		control: {
			type: 'select',
		},
		table: {
			defaultValue: { summary: 'bottom' },
		},
	},
	transitionName: {
		description: 'Dropdown show / hide transition name',
		control: {
			type: 'text',
		},
	},
	offset: {
		description: 'Offset of the dropdown from the trigger',
		control: {
			type: 'number',
		},
		table: {
			defaultValue: {
				summary: 0,
			},
			type: {
				summary: ['number', 'string', 'object'],
			},
		},
	},
	shift: {
		description:
			'Move dropdown to the side if there is no space in the default position',
		control: {
			type: 'boolean',
		},
		table: {
			defaultValue: {
				summary: true,
			},
			type: {
				summary: ['boolean', 'object'],
			},
		},
	},
	flip: {
		description:
			'Flip dropdown position if there is no space in the default position',
		control: {
			type: 'boolean',
		},
		table: {
			defaultValue: {
				summary: true,
			},
			type: {
				summary: ['boolean', 'object'],
			},
		},
	},
	autoPlacement: {
		description: 'Automatically change the position of the dropdown',
		control: {
			type: 'boolean',
		},
		table: {
			defaultValue: {
				summary: false,
			},
			type: {
				summary: ['boolean', 'object'],
			},
		},
	},
	arrow: {
		description: 'Add arrow to the dropdown',
		control: {
			type: 'boolean',
		},
		table: {
			defaultValue: {
				summary: false,
			},
			type: {
				summary: 'boolean',
			},
		},
	},
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
	autoClose: {
		description: 'Close dropdown on click outside',
		control: {
			type: 'boolean',
		},
		table: {
			defaultValue: {
				summary: true,
			},
			type: {
				summary: 'boolean',
			},
		},
	},
	triggerWidth: {
		description: 'Set dropdown width to the same as the trigger',
		control: {
			type: 'boolean',
		},
		table: {
			defaultValue: {
				summary: false,
			},
			type: {
				summary: 'boolean',
			},
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
