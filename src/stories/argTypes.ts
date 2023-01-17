import normal from '@/assets/icons/normal.json'

export const ValidArgTypes = {
	valid: {
		type: 'boolean',
		description: 'Valid state',
		table: {
			defaultValue: {
				summary: false,
			},
		},
	},
	validLabel: {
		type: {
			summary: ['string', 'string[]'],
		},
		description: 'Valid hint label',
		control: {
			type: 'text',
		},
	},
}

export const InvalidArgTypes = {
	invalid: {
		type: 'boolean',
		description: 'Invalid state',
		table: {
			defaultValue: {
				summary: false,
			},
		},
	},
	invalidLabel: {
		type: {
			summary: ['string', 'string[]'],
		},
		description: 'Invalid hint label',
		control: {
			type: 'text',
		},
	},
}

export const LoadingArgTypes = {
	loading: {
		type: 'boolean',
		description: 'Loading state',
		table: {
			defaultValue: {
				summary: false,
			},
		},
	},
	loadingLabel: {
		type: {
			summary: 'string',
		},
		description: 'Loading label',
		control: {
			type: 'text',
		},
	},
}

export const DisabledArgTypes = {
	disabled: {
		type: 'boolean',
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
		type: 'boolean',
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
		type: {
			summary: ['string', 'string[]'],
		},
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
	},
	iconPosition: {
		description: 'VvIcon position',
		options: ['', 'left', 'right'],
		control: {
			type: 'select',
		},
		table: {
			defaultValue: { summary: 'right' },
		},
	},
}

export const OptionsArgTypes = {
	options: {
		type: {
			summary: ['string[]', 'object[]'],
		},
		description: 'List of options',
		control: {
			type: 'array',
		},
	},
	labelKey: {
		type: {
			summary: ['string', 'function'],
		},
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
		type: {
			summary: ['string', 'function'],
		},
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
		type: 'number',
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
		type: 'number',
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
		type: {
			summary: ['string', 'number'],
		},
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
		type: {
			summary: 'string',
		},
		description:
			'Name of the form control. Submitted with the form as part of a name/value pair.',
		control: {
			type: 'text',
		},
	},
}

export const InputTextareaArgTypes = {
	...IdNameArgTypes,
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
	autofocus: {
		type: 'boolean',
		description: 'Global attribute autofocus.',
		table: {
			defaultValue: {
				summary: false,
			},
		},
	},
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
	minlength: {
		type: 'number',
		description:
			'Minimum length (number of characters) of value. Available for input types: text, search, url, tel, email, password.',
		control: {
			type: 'number',
		},
	},
	maxlength: {
		type: 'number',
		description:
			'Maximum length (number of characters) of value. Available for input types: text, search, url, tel, email, password, number.',
		control: {
			type: 'number',
		},
	},
	placeholder: {
		type: 'string',
		description:
			'Text that appears in the form control when it has no value set. Available for input types: text, search, url, tel, email, password, number.',
		control: {
			type: 'text',
		},
	},
	required: {
		type: 'boolean',
		description:
			'A value is required or must be check for the form to be submittable. Available for all input types except color.',
		table: {
			defaultValue: {
				summary: false,
			},
		},
	},
	label: {
		type: 'string',
		description: 'Input label',
		control: {
			type: 'text',
		},
	},
	floating: {
		type: 'boolean',
		description: 'If true the label will be floating',
		table: {
			defaultValue: {
				summary: false,
			},
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
