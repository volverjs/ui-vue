import type { ExtractPropTypes } from 'vue'
import { InputTextareaProps } from '@/props'

export const WRAP = {
	hard: 'hard',
	soft: 'soft'
}

export const SPELLCHECK = {
	true: true,
	false: false,
	default: 'default'
}

export const VvTextareaEvents = ['update:modelValue', 'focus', 'blur', 'keyup']

export const VvTextareaProps = {
	...InputTextareaProps,
	/**
	 * Textarea value
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#value
	 */
	modelValue: String,
	/**
	 * The visible width of the text control, in average character widths. If it is specified, it must be a positive integer. If it is not specified, the default value is 20.
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#cols
	 */
	cols: { type: [String, Number], default: 20 },
	/**
	 * The number of visible text lines for the control. If it is specified, it must be a positive integer. If it is not specified, the default value is 2.
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows
	 */
	rows: { type: [String, Number], default: 2 },
	/**
	 * Indicates how the control should wrap the value for form submission.
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#wrap
	 */
	wrap: { type: String, default: WRAP.soft },
	/**
	 * Specifies whether the <textarea> is subject to spell checking by the underlying browser/OS.
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#wrap
	 */
	spellcheck: { type: [Boolean, String], default: SPELLCHECK.default },
	/**
	 * If true, the textarea will be resizable
	 */
	resizable: Boolean
}

export type VvTextareaPropsTypes = ExtractPropTypes<typeof VvTextareaProps>
