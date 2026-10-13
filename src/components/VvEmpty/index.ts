import type { PropType } from 'vue'
import type { VvIconProps } from '../VvIcon'
import { ModifiersProps } from '../../props'

export const VvEmptyProps = {
    ...ModifiersProps,
    /**
     * Title, what is missing: "No messages yet"
     */
    title: { type: String, default: undefined },
    /**
     * What the empty state has to say under the title
     */
    description: { type: String, default: undefined },
    /**
     * VvIcon name or props, drawn in the media
     * @see VvIcon
     */
    icon: {
        type: [String, Object] as PropType<string | VvIconProps>,
        default: undefined,
    },
    /**
     * Tag of the title: a heading (`h2`, `h3`) when the empty state stands
     * for a whole page or section, a paragraph inside a list or a table
     */
    titleTag: { type: String, default: 'p' },
}
