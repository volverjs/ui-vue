import type { PropType } from 'vue'
import { ModifiersProps, StorageProps } from '@/props'

export interface VvAccordionGroupItem {
    title: string
    content: string
    name?: string
    disabled?: boolean
    modifiers?: string | string[]
}

export const VvAccordionGroupProps = {
    ...ModifiersProps,
    ...StorageProps,
    /**
     * VModel
     */
    modelValue: {
        type: [String, Array] as PropType<string | string[] | undefined>,
        default: undefined,
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
     * If true, the model lists the closed accordions instead of the open ones,
     * so without a model they start open: all of them with collapse, the first one without
     */
    not: Boolean,
}

export const VvAccordionGroupEvents = ['update:modelValue']
