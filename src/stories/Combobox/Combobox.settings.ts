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
	TabindexArgTypes
} from '@/stories/argTypes'
import { VvComboboxProps } from '@/components/VvCombobox'
import { propsToObject } from '@/utils/ObjectUtilities'

export const defaultArgs = {
	...propsToObject(VvComboboxProps),
	maxValues: undefined,
	options: ['Option 1', 'Option 2', 'Option 3'],
	placeholder: 'Select an option',
	label: 'Combobox label'
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
	multiple: {
		type: 'boolean',
		description:
			' This Boolean attribute indicates that multiple options can be selected in the list.',
		table: {
			defaultValue: {
				summary: false
			}
		}
	},
	label: {
		type: 'string',
		description: '<label> value for the combobox',
		control: {
			type: 'text'
		}
	},
	labelNoResults: {
		type: 'string',
		description: 'Label of "no results" options',
		control: {
			type: 'text'
		},
		table: {
			defaultValue: {
				summary: 'No results'
			}
		}
	},
	placeholder: {
		type: 'string',
		description: 'Text that appears when it has no value set.',
		control: {
			type: 'text'
		}
	},
	searchable: {
		type: 'boolean',
		description: 'Enable search in options',
		table: {
			defaultValue: {
				summary: false
			}
		}
	},
	searchPlaceholder: {
		type: 'string',
		description:
			'Text that appears in the in the search input when it has no value set..',
		control: {
			type: 'text'
		}
	},
	debounceSearch: {
		type: 'number',
		description: 'Debounce milliseconds for search',
		control: {
			type: 'number'
		}
	},
	maxValues: {
		description: 'Max number of selected values',
		type: ['number', 'string'],
		control: {
			type: 'text'
		}
	},
	separator: {
		type: 'string',
		description: 'Separator of selected values',
		control: {
			type: 'text'
		},
		table: {
			defaultValue: {
				summary: ', '
			}
		}
	},
	native: {
		type: 'boolean',
		description: 'Show native select',
		table: {
			defaultValue: {
				summary: false
			}
		}
	}
}
