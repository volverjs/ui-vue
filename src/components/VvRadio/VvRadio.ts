import { ValidProps, ErrorProps } from '../common/Props'

export const VvRadioProps = {
	...ValidProps,
	...ErrorProps,
	/**
	 * Valore del radio
	 */
	value: null,
	modelValue: { type: [Object, Number, Boolean, String] },
	label: { type: String, default: '' },
	disabled: Boolean,
	readonly: Boolean
}

export const VvRadioEvents = [
	'click',
	'update:modelValue',
	'change',
	'focus',
	'blur'
]
