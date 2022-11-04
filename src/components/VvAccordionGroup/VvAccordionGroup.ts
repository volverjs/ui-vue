interface VvAccordionGroupItem {
	name?: string
	title: string
	content: string
}

export const VvAccordionGroupProps = {
	/**
	 * VModel
	 */
	modelValue: [String, Array],
	/**
	 * Change icon position to right side
	 */
	iconRight: Boolean,
	/**
	 * Add border to accordion item
	 */
	bordered: Boolean,
	/**
	 * Accordion items
	 * @type VvAccordionGroupItem
	 */
	items: { type: Array<VvAccordionGroupItem>, default: () => [] },
	/**
	 * If true, close others accordion when an item is open
	 */
	accordion: Boolean,
	/**
	 * String or String[] of css classes (modifiers) that will be concatenated to prefix 'vv-accordion--'
	 */
	modifiers: [String, Array],
	disabled: Boolean
}

export const VvAccordionGroupEvents = ['update:open']
