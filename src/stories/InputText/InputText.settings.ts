import { HintArgTypes, InputTextareaArgTypes } from '@/stories/argTypes'
import { VvInputTextProps } from '@/components/VvInputText'
import normal from '@/assets/icons/normal.json'

export const defaultArgs = {
	...propsToObject(VvInputTextProps),
	name: 'vv-input-text',
	label: 'Input label',
	placeholder: 'Input placeholder',
	min: undefined,
	max: undefined,
	minlength: undefined,
	maxlength: undefined,
}

export const argTypes = {
	...InputTextareaArgTypes,
	...HintArgTypes,
	type: {
		description: 'Type of form control',
		options: [
			'color',
			'date',
			'datetime-local',
			'email',
			'month',
			'number',
			'password',
			'search',
			'tel',
			'text',
			'time',
			'url',
			'week',
		],
		control: {
			type: 'select',
		},
		table: {
			defaultValue: {
				summary: 'text',
			},
		},
	},
	min: {
		description:
			'Minimum value. Available for input types: date, month, week, time, datetime-local, number, range.',
		control: {
			type: 'text',
		},
	},
	max: {
		description:
			'Maximum value. Available for input types: date, month, week, time, datetime-local, number, range.',
		control: {
			type: 'text',
		},
	},
	step: {
		description:
			'Incremental values that are valid. Available for input types: date, month, week, time, datetime-local and number.',
		table: {
			defaultValue: {
				summary: 1,
			},
		},
	},
	pattern: {
		description:
			'Pattern the value must match to be valid. Available for input types: text, search, url, tel, email and password.',
		control: {
			type: 'text',
		},
	},
	multiple: {
		description:
			'Whether to allow multiple values. Available for input type email.',
		table: {
			defaultValue: {
				summary: false,
			},
		},
	},
	iconShowPassword: {
		description: 'VvIcon name for show password button',
		options: ['', ...Object.keys(normal.icons)],
		control: {
			type: 'select',
		},
		table: {
			defaultValue: {
				summary: 'eye-on',
			},
		},
	},
	iconHidePassword: {
		description: 'VvIcon name for hide password button',
		options: ['', ...Object.keys(normal.icons)],
		control: {
			type: 'select',
		},
		table: {
			defaultValue: {
				summary: 'eye-off',
			},
		},
	},
	iconClear: {
		description: 'VvIcon name for clear button',
		options: ['', ...Object.keys(normal.icons)],
		control: {
			type: 'select',
		},
		table: {
			defaultValue: {
				summary: 'close',
			},
		},
	},
	labelStepUp: {
		description: 'Label for step up button',
		control: {
			type: 'text',
		},
		table: {
			defaultValue: {
				summary: 'Increase value',
			},
		},
	},
	labelStepDown: {
		description: 'Label for step down button',
		control: {
			type: 'text',
		},
		table: {
			defaultValue: {
				summary: 'Decrease value',
			},
		},
	},
	labelShowPassword: {
		description: 'Label for show password button',
		control: {
			type: 'text',
		},
		table: {
			defaultValue: {
				summary: 'Show password',
			},
		},
	},
	labelHidePassword: {
		description: 'Label for hide password button',

		control: {
			type: 'text',
		},
		table: {
			defaultValue: {
				summary: 'Hide password',
			},
		},
	},
	labelClear: {
		description: 'Label for clear button',

		control: {
			type: 'text',
		},
		table: {
			defaultValue: {
				summary: 'Clear',
			},
		},
	},
	mask: {
		description: 'Input mask, only for text type',

		control: {
			type: 'text',
		},
	},
	maskEager: {
		description: 'Show mask before typing',
		table: {
			defaultValue: {
				summary: false,
			},
		},
	},
	maskReversed: {
		description: 'Write typing reverse (ex. for numbers)',
		table: {
			defaultValue: {
				summary: false,
			},
		},
	},
	maskTokens: {
		description: 'Add mask custom tokens',
		table: {
			defaultValue: {
				summary: 'undefined',
			},
		},
	},
	maskTokensReplace: {
		description: 'Replace default tokens',
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
}
