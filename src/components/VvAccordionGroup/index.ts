import { ModifiersProps } from '@/props'

export interface VvAccordionGroupItem {
	title: string
	content: string
	name?: string
	disabled?: boolean
	modifiers?: string | string[]
}

export const VvAccordionGroupProps = {
	...ModifiersProps,
	/**
	 * VModel
	 */
	modelValue: {
		type: [String, Array] as PropType<string | string[] | undefined>,
	},
	/**
	 * Accordion items
	 * @type VvAccordionGroupItem
	 */
	items: {
		type: Array as PropType<VvAccordionGroupItem[]>,
		default: () => [],
	},
	/**
	 * If true, accordion items stay open when another item is opened
	 */
	collapse: Boolean,
	/**
	 * String or String[] of css classes (modifiers) that will be concatenated to prefix 'vv-accordion--'
	 */
	itemModifiers: {
		type: [String, Array] as PropType<string | string[]>,
		default: '',
	},
	/**
	 * If true, the accordion items will be disabled
	 */
	disabled: Boolean,
	/**
	 * If true, the accordion items will be opened by default
	 */
	not: Boolean,
	/**
	 * Enable local storage persistence
	 */
	storeKey: String,
}

export const VvAccordionGroupEvents = ['update:modelValue']
