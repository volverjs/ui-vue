import type { NavItemTab } from '@/types/nav'
import { ModifiersProps } from '@/props'

export const VvTabProps = {
    ...ModifiersProps,
    navModifiers: {
        type: [String, Array] as PropType<string | string[]>,
    },
    modelValue: {
        type: String,
        default: '',
    },
    items: {
        type: Array as PropType<NavItemTab[]>,
        default: () => [],
    },
}

export const VvTabEvents = ['update:modelValue']
