import { ModifiersProps } from '@/props'

export const VvProgressProps = {
	...ModifiersProps,
	/**
	 * Progress value
	 * This attribute specifies how much of the task that has been completed.
	 * It must be a valid floating point number between 0 and max, or between 0 and 1 if max is omitted.
	 * If there is no value attribute, the progress bar is indeterminate.
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#attr-max
	 */
	value: {
		type: [Number, String],
		default: undefined
	},
	/**
	 * Progress max
	 * This attribute describes how much work the task indicated by the progress element requires.
	 * The max attribute, if present, must have a value greater than 0 and be a valid floating point number. The default value is 1.
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#attr-max
	 */
	max: {
		type: [Number, String]
	},
	/**
	 * Progress aria-label
	 */
	label: {
		type: String,
		required: true
	}
}
