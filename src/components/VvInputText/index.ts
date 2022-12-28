import type { ExtractPropTypes } from 'vue'
import {
	ValidProps,
	ErrorProps,
	HintProps,
	LoadingProps,
	ModifiersProps,
	LimitProps,
	InputProps
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
	PASSWORD_SHOW: 'eye-on',
	PASSWORD_HIDE: 'eye-off',
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
	...InputProps,
	/**
	 * Input value
	 */
	modelValue: {
		type: [String, Number],
		default: undefined
	},
	/**
	 * Input type
	 */
	type: {
		type: String,
		default: TYPES.TEXT,
		validator: (value: string) => Object.values(TYPES).includes(value)
	},
	min: [Number, Date],
	max: [Number, Date],
	step: { type: Number, default: 1 },
	labelStepUp: {
		type: String,
		default: 'Increase value'
	},
	labelStepDown: {
		type: String,
		default: 'Decrease value'
	},
	labelShowPassword: {
		type: String,
		default: 'Show password'
	},
	labelHidePassword: {
		type: String,
		default: 'Hide password'
	},
	labelClear: {
		type: String,
		default: 'Clear'
	},
	iconShowPassword: {
		type: String,
		default: TYPES_ICON.PASSWORD_SHOW
	},
	iconHidePassword: {
		type: String,
		default: TYPES_ICON.PASSWORD_HIDE
	},
	iconClear: {
		type: String,
		default: TYPES_ICON.SEARCH
	},
	/**
	 * Icon name
	 * @see DsIcon
	 */
	icon: {
		type: [String, Object],
		default: ''
	},
	/**
	 * Icon position
	 */
	iconPosition: {
		type: String,
		validation: (value: string) =>
			Object.values(ICON_POSITIONS).includes(value),
		default: ICON_POSITIONS.RIGHT
	},
	/**
	 * If true the label will be floating
	 */
	floating: Boolean,
	debounce: [String, Number],
	/**
	 * Sequential keyboard navigation
	 */
	tabindex: { type: [String, Number], default: 0 }
}

export type VvInputTextPropsTypes = ExtractPropTypes<typeof VvInputTextProps>
