export interface VvAccordionGroupItem {
	title: string
	content: string
	name?: string
	disabled?: boolean
}

export const VvAccordionGroupProps = {
	/**
	 * VModel
	 */
	modelValue: [String, Array],
	/**
	 * Accordion items
	 * @type VvAccordionGroupItem
	 */
	items: { type: Array<VvAccordionGroupItem>, default: () => [] },
	/**
	 * If true, accordion items stay open when another item is opened.
	 */
	collapse: Boolean,
	/**
	 * String or String[] of css classes (modifiers) that will be concatenated to prefix 'vv-accordion--'
	 */
	modifiers: [String, Array],
	disabled: Boolean
}

export const VvAccordionGroupEvents = ['update:modelValue']
