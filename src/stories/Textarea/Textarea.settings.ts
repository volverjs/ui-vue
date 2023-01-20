import { InputTextareaArgTypes } from '@/stories/argTypes'
import { VvTextareaProps } from '@/components/VvTextarea'

export const defaultArgs = {
	...propsToObject(VvTextareaProps),
	name: 'vv-textarea',
	label: 'Textarea label',
	placeholder: 'Textarea placeholder',
	minlength: undefined,
	maxlength: undefined,
}

export const argTypes = {
	...InputTextareaArgTypes,
	cols: {
		type: 'number',
		description:
			'The visible width of the text control, in average character widths. If it is specified, it must be a positive integer. If it is not specified, the default value is 20.',
		control: {
			type: 'number',
		},
		table: {
			defaultValue: {
				summary: 20,
			},
		},
	},
	rows: {
		type: 'number',
		description:
			'The number of visible text lines for the control. If it is specified, it must be a positive integer. If it is not specified, the default value is 2.',
		control: {
			type: 'number',
		},
		table: {
			defaultValue: {
				summary: 2,
			},
		},
	},
	wrap: {
		type: {
			summary: 'string',
		},
		description:
			'Indicates how the control should wrap the value for form submission.',
		options: ['hard', 'soft', 'off'],
		control: {
			type: 'check',
		},
		table: {
			defaultValue: {
				summary: 'soft',
			},
		},
	},
	spellcheck: {
		type: {
			summary: ['string', 'boolean'],
		},
		description:
			'Specifies whether the textarea is subject to spell checking by the underlying browser/OS. ',
		options: [true, false, 'default'],
		control: {
			type: 'check',
		},
		table: {
			defaultValue: {
				summary: 'default',
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
