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
	open: {
		type: Boolean,
		default: undefined
	},
	/**
	 * String or String[] of css classes (modifiers) that will be concatenated to prefix 'vv-accordion--'
	 */
	modifiers: [String, Array],
	disabled: Boolean
}

export const VvAccordionEvents = ['update:open']
export type VvAccordionPropsTypes = ExtractPropTypes<typeof VvAccordionProps>
