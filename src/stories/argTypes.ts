import normal from '../assets/icons/normal.json'
import { Placement, Position, Side } from '../constants'

export const ValidArgTypes = {
	valid: {
		description: 'Valid state',
		table: {
			defaultValue: {
				summary: false,
			},
		},
	},
	validLabel: {
		description: 'Valid hint label',
		control: {
			type: 'text',
		},
	},
}

export const InvalidArgTypes = {
	invalid: {
		description: 'Invalid state',
		table: {
			defaultValue: {
				summary: false,
			},
		},
	},
	invalidLabel: {
		description: 'Invalid hint label',
		control: {
			type: 'text',
		},
	},
}

export const LoadingArgTypes = {
	loading: {
		description: 'Loading state',
		table: {
			defaultValue: {
				summary: false,
			},
		},
	},
	loadingLabel: {
		description: 'Loading label',
		control: {
			type: 'text',
		},
	},
}

export const DisabledArgTypes = {
	disabled: {
		description: 'Whether the form control is disabled',
		table: {
			defaultValue: {
				summary: false,
			},
		},
	},
}

export const ReadonlyArgTypes = {
	readonly: {
		description: 'The value is not editable',
		table: {
			defaultValue: {
				summary: false,
			},
		},
	},
}

export const ModifiersArgTypes = {
	modifiers: {
		description: 'Component BEM modifiers',
		options: [],
		control: {
			type: 'check',
		},
	},
}

export const IconArgTypes = {
	icon: {
		description: 'VvIcon name or props',
		options: ['', ...Object.keys(normal.icons)],
		control: {
			type: 'select',
		},
		table: {
			defaultValue: { summary: 'add' },
		},
	},
	iconPosition: {
		description: 'VvIcon position',
		options: ['', ...Object.values(Position)],
		control: {
			type: 'select',
		},
		table: {
			defaultValue: { summary: Position.before },
		},
	},
}

export const OptionsArgTypes = {
	options: {
		description: 'List of options',
		control: {
			type: 'array',
		},
	},
	labelKey: {
		description: 'Key of label in option object',
		control: {
			type: 'text',
		},
		table: {
			defaultValue: {
				summary: 'label',
			},
		},
	},
	valueKey: {
		description: 'Key of value in option object',
		control: {
			type: 'text',
		},
		table: {
			defaultValue: {
				summary: 'value',
			},
		},
	},
	disabledKey: {
		description: 'Key of disabled in option object',
		control: {
			type: 'text',
		},
		table: {
			defaultValue: {
				summary: 'disabled',
			},
		},
	},
}

export const CountArgTypes = {
	count: {
		description: 'Show character limit',
		options: [true, false, 'limit', 'countdown'],
		control: {
			type: 'radio',
		},
		table: {
			category: null,
			defaultValue: {
				summary: false,
			},
			type: {
				summary: ['boolean', 'string'],
			},
		},
	},
}

export const DebounceArgTypes = {
	debounce: {
		description: 'Debounce milliseconds',
		control: {
			type: 'number',
		},
	},
}

export const DefaultSlotArgTypes = {
	default: {
		description: 'The default slot',
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

export const HintArgTypes = {
	hintLabel: {
		description: 'Hint label',
		control: {
			type: 'text',
		},
		table: {
			type: {
				summary: 'string',
			},
		},
	},
	hint: {
		description: 'The hint slot',
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

export const TabindexArgTypes = {
	tabindex: {
		description: 'Global attribute tabindex',
		control: {
			type: 'number',
		},
		table: {
			defaultValue: {
				summary: 0,
			},
		},
	},
}

export const IdNameArgTypes = {
	id: {
		description: 'Global attribute id.',
		control: {
			type: 'text',
		},
		table: {
			defaultValue: {
				summary: 'nanoid',
			},
		},
	},
	name: {
		description:
			'Name of the form control. Submitted with the form as part of a name/value pair.',
		control: {
			type: 'text',
		},
	},
}

export const DropdownArgTypes = {
	placement: {
		description: 'Dropdown placement',
		options: [...Object.values(Placement), ...Object.values(Side)],
		control: {
			type: 'select',
		},
		table: {
			defaultValue: { summary: 'bottom' },
		},
	},
	strategy: {
		description: 'Dropdown strategy',
		options: ['fixed', 'absolute'],
		control: {
			type: 'select',
		},
		table: {
			defaultValue: { summary: 'absolute' },
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
	size: {
		description:
			'Change the size of the dropdown to not overflow the viewport',
		control: {
			type: 'object',
		},
		table: {
			defaultValue: {
				summary: '{ "padding": 10 }',
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
}

export const UnselectableArgTypes = {
	unselectable: {
		description: 'If true the field will be unselectable',
		table: {
			defaultValue: {
				summary: true,
			},
		},
	},
}

export const FloatingLabelArgTypes = {
	floating: {
		description: 'If true the label will be floating',
		table: {
			defaultValue: {
				summary: false,
			},
		},
	},
}

export const AutofocusArgTypes = {
	autofocus: {
		description: 'Global attribute autofocus.',
		table: {
			defaultValue: {
				summary: false,
			},
		},
	},
}

export const AutocompleteArgTypes = {
	autocomplete: {
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
}

export const InputTextareaArgTypes = {
	...IdNameArgTypes,
	...AutofocusArgTypes,
	...AutocompleteArgTypes,
	...TabindexArgTypes,
	...DisabledArgTypes,
	...ReadonlyArgTypes,
	...ValidArgTypes,
	...InvalidArgTypes,
	...HintArgTypes,
	...LoadingArgTypes,
	...ModifiersArgTypes,
	...CountArgTypes,
	...DebounceArgTypes,
	...IconArgTypes,
	...FloatingLabelArgTypes,
	minlength: {
		description:
			'Minimum length (number of characters) of value. Available for input types: text, search, url, tel, email, password.',
		control: {
			type: 'number',
		},
	},
	maxlength: {
		description:
			'Maximum length (number of characters) of value. Available for input types: text, search, url, tel, email, password, number.',
		control: {
			type: 'number',
		},
	},
	placeholder: {
		description:
			'Text that appears in the form control when it has no value set. Available for input types: text, search, url, tel, email, password, number.',
		control: {
			type: 'text',
		},
	},
	required: {
		description:
			'A value is required or must be check for the form to be submittable. Available for all input types except color.',
		table: {
			defaultValue: {
				summary: false,
			},
		},
	},
	label: {
		description: 'Input label',
		control: {
			type: 'text',
		},
	},
}

export const CheckboxRadioArgTypes = {
	...IdNameArgTypes,
	...TabindexArgTypes,
	...ValidArgTypes,
	...InvalidArgTypes,
	...HintArgTypes,
	...DisabledArgTypes,
	...ReadonlyArgTypes,
	label: {
		type: 'string',
		description: 'Input label',
		control: {
			type: 'text',
		},
	},
	value: {
		type: ['string', 'number', 'boolean'],
		description: 'Input value',
		control: {
			type: 'text',
		},
	},
}

export const CheckboxRadioGroupArgTypes = {
	...ValidArgTypes,
	...InvalidArgTypes,
	...OptionsArgTypes,
	...HintArgTypes,
	...DisabledArgTypes,
	...ReadonlyArgTypes,
	label: {
		type: 'string',
		description: 'Input label',
		control: {
			type: 'text',
		},
	},
	name: {
		type: {
			summary: 'string',
		},
		description:
			'Name of the form control. Submitted with the form as part of a name/value pair.',
		control: {
			type: 'text',
		},
	},
	vertical: {
		type: 'boolean',
		description:
			'If true the options will be displayed vertically instead of horizontally',
		table: {
			defaultValue: {
				summary: false,
			},
		},
	},
	default: {
		description: 'Default slot for the options',
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
