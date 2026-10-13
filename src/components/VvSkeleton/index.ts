import type { PropType } from 'vue'
import { ModifiersProps } from '../../props'

export const VvSkeletonProps = {
    ...ModifiersProps,
    /**
     * Show the placeholder. When false the default slot, the content the
     * placeholder stands for, is shown in its place
     */
    loading: { type: Boolean, default: true },
    /**
     * Number of bars
     */
    items: { type: [Number, String], default: 1 },
    /**
     * Class of the bars, width and height utilities as `max-w-192`: a string
     * for every bar, an array for one bar each
     */
    itemClass: {
        type: [String, Array] as PropType<string | string[]>,
        default: undefined,
    },
    /**
     * Accessible name, announced through `role="status"` while loading
     */
    label: { type: String, default: 'Loading' },
}
