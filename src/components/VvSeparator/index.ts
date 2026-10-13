import { ModifiersProps } from '../../props'

export const VvSeparatorProps = {
    ...ModifiersProps,
    /**
     * Text on the line, such as "or" or a date. With a label the line is
     * drawn around a text that is read, without `role="separator"`, whose
     * content would be hidden from assistive technologies
     */
    label: { type: String, default: undefined },
    /**
     * Stand the line up between two items of a row
     */
    vertical: { type: Boolean, default: false },
}
