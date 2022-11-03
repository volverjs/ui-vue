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
	/**
	 * String or String[] of css classes (modifiers) that will be concatenated to prefix 'vv-dropdown--'
	 */
	modifiers: [String, Array],
	loading: Boolean,
	disabled: Boolean,
	readonly: Boolean,
	hintLabel: { type: String, default: '' },
	valid: Boolean,
	validLabel: [String, Array],
	error: Boolean,
	errorLabel: [String, Array]
}
