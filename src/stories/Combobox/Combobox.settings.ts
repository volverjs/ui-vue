import type { VvCombobox } from '@/components'
import type { Meta } from '@storybook/vue3'
import {
	ValidArgTypes,
	InvalidArgTypes,
	HintArgTypes,
	LoadingArgTypes,
	DisabledArgTypes,
	ReadonlyArgTypes,
	ModifiersArgTypes,
	OptionsArgTypes,
	IconArgTypes,
	TabindexArgTypes,
	FloatingLabelArgTypes,
	UnselectableArgTypes,
	DropdownArgTypes,
} from '@/stories/argTypes'
import { VvComboboxProps } from '@/components/VvCombobox'

export const defaultArgs: Meta<typeof VvCombobox>['args'] = {
	...propsToObject(VvComboboxProps),
	name: 'vv-combobox',
	maxValues: undefined,
	options: [
		'Option 1',
		'Option 2',
		'Option 3',
		'Option 4',
		'Option 5',
		'Option 6',
		'Option 7',
		'Option 8',
		'Option 9',
		'Option 10',
		'Option 11',
		'Option 12',
		'Option 13',
		'Option 14',
		'Option 15',
		'Option 16',
		'Option 17',
		'Option 18',
		'Option 19',
		'Option 20',
	],
	placeholder: 'Select an option',
	label: 'Combobox label',
	strategy: 'fixed',
}

export const argTypes = {
	...TabindexArgTypes,
	...ValidArgTypes,
	...InvalidArgTypes,
	...HintArgTypes,
	...LoadingArgTypes,
	...DisabledArgTypes,
	...ReadonlyArgTypes,
	...ModifiersArgTypes,
	...OptionsArgTypes,
	...IconArgTypes,
	...FloatingLabelArgTypes,
	...UnselectableArgTypes,
	...DropdownArgTypes,
	triggerWidth: {
		...DropdownArgTypes.triggerWidth,
		table: {
			defaultValue: {
				summary: true,
			},
		},
	},
	multiple: {
		description:
			' This Boolean attribute indicates that multiple options can be selected in the list.',
		table: {
			defaultValue: {
				summary: false,
			},
		},
	},
	label: {
		description: '<label> value for the combobox',
		control: {
			type: 'text',
		},
	},
	noResultsLabel: {
		description: 'Label of "no results" options',
		control: {
			type: 'text',
		},
		table: {
			defaultValue: {
				summary: 'No results',
			},
		},
	},
	placeholder: {
		description: 'Text that appears when it has no value set.',
		control: {
			type: 'text',
		},
	},
	searchable: {
		description: 'Enable search in options',
		table: {
			defaultValue: {
				summary: false,
			},
		},
	},
	searchPlaceholder: {
		description:
			'Text that appears in the in the search input when it has no value set..',
		control: {
			type: 'text',
		},
	},
	debounceSearch: {
		description: 'Debounce milliseconds for search',
		control: {
			type: 'number',
		},
	},
	maxValues: {
		description: 'Max number of selected values',

		control: {
			type: 'text',
		},
	},
	separator: {
		description: 'Separator of selected values',
		control: {
			type: 'text',
		},
		table: {
			defaultValue: {
				summary: ', ',
			},
		},
	},
	native: {
		description: 'Show native select',
		table: {
			defaultValue: {
				summary: false,
			},
		},
	},
	badges: {
		description: 'Show badges for selected values',
		table: {
			defaultValue: {
				summary: false,
			},
		},
	},
	badgeModifiers: {
		description: 'Modifiers for badges',
		control: {
			type: 'text',
		},
		table: {
			defaultValue: {
				summary: 'action sm',
			},
		},
	},
	dropdownModifiers: {
		control: {
			type: 'text',
		},
		description: 'Modifiers for dropdown',
	},
	autoOpen: {
		description: 'Open dropdown on focus',
		table: {
			defaultValue: {
				summary: false,
			},
		},
	},
	keepOpen: {
		description: 'Keep open dropdown on signle select',
		table: {
			defaultValue: {
				summary: false,
			},
		},
	},
	before: {
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
	'dropdown::before': {
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
	'dropdown::after': {
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
	value: {
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
	option: {
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
	'no-options': {
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
	'no-results': {
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
