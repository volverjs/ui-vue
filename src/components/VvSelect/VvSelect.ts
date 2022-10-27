import type { PropType } from 'vue'

interface Option {
	value: string | number | boolean
	label: string
}

export const VvSelectProps = {
	modelValue: {
		type: [String, Array],
		required: true
	},
	label: String,
	placeholder: String,
	options: {
		type: Array as PropType<Array<Option>>,
		required: true
	},
	multiple: Boolean,
	iconLeft: String,
	iconRight: String,
	disabled: Boolean,
	readonly: Boolean,
	valid: Boolean,
	validLabel: [String, Array],
	error: Boolean,
	errors: [String, Array]
}
