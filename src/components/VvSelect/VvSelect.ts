import type { PropType } from 'vue'

export interface Option {
	[key: string]: any
}

export const VvSelectProps = {
	modelValue: {
		type: [String, Array],
		required: true
	},
	label: String,
	placeholder: String,
	options: {
		type: Array as PropType<Array<Option | string>>,
		required: true
	},
	labelKey: { type: String, default: 'label' },
	valueKey: { type: String, default: 'value' },
	iconLeft: String,
	iconRight: String,
	disabled: Boolean,
	readonly: Boolean,
	hintLabel: { type: String, default: '' },
	valid: Boolean,
	validLabel: [String, Array],
	error: Boolean,
	errors: [String, Array]
}
