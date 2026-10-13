import type { PropType } from 'vue'
import type { VvIconProps } from '../VvIcon'
import { ModifiersProps } from '../../props'

export const VvMarkerProps = {
    ...ModifiersProps,
    /**
     * Text of the note: "Maria joined the conversation"
     */
    label: { type: String, default: undefined },
    /**
     * VvIcon name or props, beside the text
     * @see VvIcon
     */
    icon: {
        type: [String, Object] as PropType<string | VvIconProps>,
        default: undefined,
    },
}
