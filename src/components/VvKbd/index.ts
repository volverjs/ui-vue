import type { PropType } from 'vue'
import { ModifiersProps } from '../../props'

export const VvKbdProps = {
    ...ModifiersProps,
    /**
     * The key, or the keys of a combination, as `['Ctrl', 'K']`
     */
    keys: {
        type: [String, Array] as PropType<string | string[]>,
        default: undefined,
    },
    /**
     * What joins the keys of a combination, written between them: empty for
     * none, as in `⌘S`
     */
    separator: { type: String, default: '+' },
}
