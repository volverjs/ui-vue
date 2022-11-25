import type { ExtractPropTypes, PropType } from 'vue'
import {
	ValidProps,
	ErrorProps,
	HintProps,
	LoadingProps,
	ModifiersProps,
	LimitProps
} from '../../props'
import { TYPES, ICON_POSITIONS } from './constants'

export const VvInputTextEvents = ['update:modelValue', 'focus', 'blur', 'keyup']

export const VvInputTextProps = {
	...ValidProps,
	...ErrorProps,
	...HintProps,
	...LoadingProps,
	...ModifiersProps,
	...LimitProps,
	modelValue: {
		type: [String, Number],
		default: null
	},
	type: {
		type: String,
		default: TYPES.TEXT,
		validator: (value: string) => Object.values(TYPES).includes(value)
	},
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
	icon: {
		type: [String, Object],
		default: ''
	},
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
	debounce: Number,
	/**
	 * Se true, attiva la possibilità di cancellare il testo nella textarea
	 */
	autoclear: Boolean
}

type VvInputTextPropsType = typeof VvInputTextProps
export type VvInputTextPropsTypes = ExtractPropTypes<VvInputTextPropsType>
