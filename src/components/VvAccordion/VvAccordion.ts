import type { ExtractPropTypes } from 'vue'

export const VvAccordionProps = {
	/**
	 * Accordion header title
	 */
	title: String,
	/**
	 * Accordion content description
	 */
	content: String,
	/**
	 * (Optional) Defines if item is open. Event "update:open" is emitted on accordion header click
	 */
	open: Boolean,
	/**
	 * Change icon position to right side
	 */
	iconRight: Boolean,
	/**
	 * Add border to accordion item
	 */
	bordered: Boolean,
	/**
	 * String or String[] of css classes (modifiers) that will be concatenated to prefix 'vv-accordion--'
	 */
	modifiers: [String, Array],
	disabled: Boolean
}

export const VvAccordionEvents = ['update:open']

type _VvAccordionPropsType = typeof VvAccordionProps
export type VvAccordionPropsTypes = ExtractPropTypes<_VvAccordionPropsType>
