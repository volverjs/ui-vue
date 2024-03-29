import type { ExtractPropTypes, PropType } from 'vue'
import type { FactoryOpts } from 'imask'
import { InputTextareaProps, StorageProps } from '../../props'
import { type VvIconProps, ACTION_ICONS } from '../VvIcon'

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

export const VvInputTextEvents = [
	'update:modelValue',
	'update:masked',
	'accept',
	'accept:typed',
	'accept:masked',
	'accept:unmasked',
	'complete',
	'complete:typed',
	'complete:masked',
	'complete:unmasked',
	'focus',
	'blur',
	'keyup',
	'keydown',
	'keypress',
]

export const VvInputTextProps = {
	...InputTextareaProps,
	...StorageProps,
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
		type: [String, Object] as PropType<string | VvIconProps>,
		default: ACTION_ICONS.showPassword,
	},
	/**
	 * VvIcon name for hide password button
	 * @see VVIcon
	 */
	iconHidePassword: {
		type: [String, Object] as PropType<string | VvIconProps>,
		default: ACTION_ICONS.hidePassword,
	},
	/**
	 * VvIcon name for clear button
	 * @see VVIcon
	 */
	iconClear: {
		type: [String, Object] as PropType<string | VvIconProps>,
		default: ACTION_ICONS.clear,
	},
	/**
	 * VvIcon name for remove suggestion button
	 * @see VVIcon
	 */
	iconRemoveSuggestion: {
		type: [String, Object] as PropType<string | VvIconProps>,
		default: ACTION_ICONS.remove,
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
	/**
	 * Label for remove suggestion button
	 */
	labelRemoveSuggestion: {
		type: String,
		default: 'Remove suggestion',
	},
	/**
	 * iMask options
	 * @see https://imask.js.org/guide.html
	 */
	iMask: {
		type: Object as PropType<FactoryOpts>,
		default: undefined,
	},
	/**
	 * Masked value
	 */
	masked: {
		type: String,
		default: undefined,
	},
	/**
	 * Adjust input width to content
	 */
	autoWidth: {
		type: Boolean,
		default: false,
	},
	/**
	 * Hide type number, password and search actions
	 */
	hideActions: {
		type: Boolean,
		default: false,
	},
	/**
	 * Add unit label to input
	 */
	unit: {
		type: String,
	},
	/**
	 * Select input text on focus
	 */
	selectOnFocus: {
		type: Boolean,
		default: false,
	},
	/**
	 * Maximum number of suggestions
	 */
	maxSuggestions: {
		type: Number,
		default: 5,
	},
}

export type VvInputTextPropsTypes = ExtractPropTypes<typeof VvInputTextProps>
