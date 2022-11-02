import type { PropType } from 'vue'

export interface Option {
	[key: string]: any
}

export const VvDropdownProps = {
	modelValue: [String, Array, Object],
	label: String,
	placeholder: String,
	options: {
		type: Array as PropType<Array<Option | string>>,
		required: true
	},
	useObject: Boolean,
	multiple: Boolean,
	separator: { type: String, default: ', ' },
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
