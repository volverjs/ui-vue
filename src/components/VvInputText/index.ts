import type { ExtractPropTypes, PropType } from 'vue'
import { InputTextareaProps } from '@/props'

export const INPUT_TYPES = {
	TEXT: 'text',
	PASSWORD: 'password',
	NUMBER: 'number',
	EMAIL: 'email',
	TEL: 'tel',
	URL: 'url',
	COLOR: 'color',
	SEARCH: 'search',
	DATE: 'date',
	TIME: 'time',
	DATETIME_LOCAL: 'datetime-local',
	MONTH: 'month',
	WEEK: 'week',
} as const
export type InputType = ValueOf<typeof INPUT_TYPES>

export const TYPES_ICON = {
	PASSWORD_SHOW: 'eye-on',
	PASSWORD_HIDE: 'eye-off',
	DATE: 'calendar',
	TIME: 'time',
	COLOR: 'color',
	SEARCH: 'close',
} as const

export const VvInputTextEvents = ['update:modelValue', 'focus', 'blur', 'keyup']

export const VvInputTextProps = {
	...InputTextareaProps,
	/**
	 * Input value
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#value
	 */
	modelValue: [String, Number],
	/**
	 * Type of form control
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#type
	 */
	type: {
		type: String as PropType<InputType>,
		default: INPUT_TYPES.TEXT,
		validator: (value: InputType) =>
			Object.values(INPUT_TYPES).includes(value),
	},
	/**
	 * Minimum value
	 * Available for input types: date, month, week, time, datetime-local, number, range.
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#min
	 */
	min: [Number, Date, String],
	/**
	 * Maximum value
	 * Available for input types: date, month, week, time, datetime-local, number, range.
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#max
	 */
	max: [Number, Date, String],
	/**
	 * Incremental values that are valid
	 * Available for input types: date, month, week, time, datetime-local and number
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#step
	 */
	step: { type: [String, Number], default: 1 },
	/**
	 * Pattern the value must match to be valid
	 * Available for input types: text, search, url, tel, email and password
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#pattern
	 */
	pattern: String,
	/**
	 * Whether to allow multiple values
	 * Available for input type email
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#multiple
	 */
	multiple: Boolean,
	/**
	 * VvIcon name for show password button
	 * @see VVIcon
	 */
	iconShowPassword: {
		type: String,
		default: TYPES_ICON.PASSWORD_SHOW,
	},
	/**
	 * VvIcon name for hide password button
	 * @see VVIcon
	 */
	iconHidePassword: {
		type: String,
		default: TYPES_ICON.PASSWORD_HIDE,
	},
	/**
	 * VvIcon name for clear button
	 * @see VVIcon
	 */
	iconClear: {
		type: String,
		default: TYPES_ICON.SEARCH,
	},
	/**
	 * Label for step up button
	 */
	labelStepUp: {
		type: String,
		default: 'Increase value',
	},
	/**
	 * Label for step down button
	 */
	labelStepDown: {
		type: String,
		default: 'Decrease value',
	},
	/**
	 * Label for show password button
	 */
	labelShowPassword: {
		type: String,
		default: 'Show password',
	},
	/**
	 * Label for hide password button
	 */
	labelHidePassword: {
		type: String,
		default: 'Hide password',
	},
	/**
	 * Label for clear button
	 */
	labelClear: {
		type: String,
		default: 'Clear',
	},
}

export type VvInputTextPropsTypes = ExtractPropTypes<typeof VvInputTextProps>
