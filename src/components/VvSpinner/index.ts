import { ModifiersProps } from '../../props'

export const VvSpinnerProps = {
    ...ModifiersProps,
    /**
     * Accessible name, announced through `role="status"` while the spinner
     * stands alone
     */
    label: { type: String, default: 'Loading' },
    /**
     * Hide the spinner from assistive technologies, when a visible text next
     * to it already says what is happening, as the label of a button
     */
    decorative: { type: Boolean, default: false },
}
