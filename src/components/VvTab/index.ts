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
    /**
     * Panel rendering strategy:
     * false (default) renders every panel eagerly,
     * true renders only the active panel,
     * 'once' renders a panel on first activation and keeps it mounted.
     */
    lazy: {
        type: [Boolean, String] as PropType<boolean | 'once'>,
        default: false,
    },
}

export const VvTabEvents = ['update:modelValue']
