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
	IdNameArgTypes,
} from '@/stories/argTypes'
import { propsToObject } from '@/utils/ObjectUtilities'
import { VvSelectProps } from '@/components/VvSelect'

export const defaultArgs = {
	...propsToObject(VvSelectProps),
	options: ['Option 1', 'Option 2', 'Option 3'],
	placeholder: 'Select an option',
	label: 'Select label',
}
export const argTypes = {
	...IdNameArgTypes,
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
	autocomplete: {
		type: {
			summary: 'string',
		},
		description: 'Hint for for autofill feature.',
		control: {
			type: 'text',
		},
		table: {
			defaultValue: {
				summary: 'off',
			},
		},
	},
	autofocus: {
		type: 'boolean',
		description: 'Global attribute autofocus.',
		table: {
			defaultValue: {
				summary: false,
			},
		},
	},
	multiple: {
		type: 'boolean',
		description:
			'This Boolean attribute indicates that multiple options can be selected in the list.',
		table: {
			defaultValue: {
				summary: false,
			},
		},
	},
	required: {
		type: 'boolean',
		description:
			'A Boolean attribute indicating that an option with a non-empty string value must be selected.',
		table: {
			defaultValue: {
				summary: false,
			},
		},
	},
	size: {
		type: 'string',
		description:
			'If the control is presented as a scrolling list box this attribute represents the number of rows in the list.',
		control: {
			type: 'text',
		},
	},
	label: {
		type: 'string',
		description: '<label> value for the select',
		control: {
			type: 'text',
		},
	},
	placeholder: {
		type: 'string',
		description: 'Text that appears when it has no value set.',
		control: {
			type: 'text',
		},
	},
}
