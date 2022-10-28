export const VvRadioProps = {
	/**
	 * Valore del radio
	 */
	value: null,
	modelValue: { type: [Object, Number, Boolean, String] },
	label: { type: String, default: '' },
	disabled: Boolean,
	readonly: Boolean,
	valid: Boolean,
	validLabel: [String, Array],
	error: Boolean,
	errors: [String, Array]
}

export const VvRadioEvents = [
	'click',
	'update:modelValue',
	'change',
	'focus',
	'blur'
]
