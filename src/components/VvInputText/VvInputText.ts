import { ValidProps, ErrorProps, HintProps, LoadingProps } from '../../props'
import { TYPES, ICON_POSITIONS } from './constants'

export const VvInputTextEvents = ['update:modelValue', 'focus', 'blur']

export const VvInputTextProps = {
	...ValidProps,
	...ErrorProps,
	...HintProps,
	...LoadingProps,
	modelValue: null,
	type: {
		type: String,
		default: TYPES.TEXT,
		validator: (value: string) => Object.values(TYPES).includes(value)
	},
	id: String,
	name: { type: String, required: true },
	autocomplete: { type: String, default: 'off' },
	autofocus: Boolean,
	minlength: Number,
	maxlength: Number,
	min: [Number, Date],
	max: [Number, Date],
	step: Number,
	label: String,
	disabled: Boolean,
	readonly: Boolean,
	placeholder: String,
	/**
	 * Nome dell'icona
	 * @see DsIcon
	 */
	icon: { type: String, default: '' },
	/**
	 * Posizione dell'icona
	 */
	iconPosition: {
		type: String,
		validation: (value: string) =>
			Object.values(ICON_POSITIONS).includes(value),
		default: ICON_POSITIONS.RIGHT
	},
	/**
	 * True = label flottante
	 */
	floating: Boolean,
	debounce: Number
}