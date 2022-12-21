import type { ExtractPropTypes } from 'vue'
import {
	ValidProps,
	ErrorProps,
	HintProps,
	LoadingProps,
	ModifiersProps,
	LimitProps
} from '@/props'

export const TYPES = {
	TEXT: 'text',
	PASSWORD: 'password',
	DATE: 'date',
	DATETIME_LOCAL: 'datetime-local',
	NUMBER: 'number',
	TIME: 'time',
	EMAIL: 'email',
	TEL: 'tel',
	URL: 'url',
	COLOR: 'color',
	SEARCH: 'search',
	FILE: 'file'
}

export const ICON_POSITIONS = {
	LEFT: 'left',
	RIGHT: 'right'
}

export const TYPES_ICON = {
	PASSWORD_ON: 'eye-on',
	PASSWORD_OFF: 'eye-off',
	DATE: 'calendar',
	TIME: 'time',
	COLOR: 'color',
	SEARCH: 'close'
}

export const INPUT = {
	TYPES,
	ICON_POSITIONS,
	TYPES_ICON
}

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
	debounce: [String, Number],
	/**
	 * Se true, attiva la possibilità di cancellare il testo nella textarea
	 */
	autoclear: Boolean
}

export type VvInputTextPropsTypes = ExtractPropTypes<typeof VvInputTextProps>
