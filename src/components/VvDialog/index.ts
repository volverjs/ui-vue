import { IdProps, ModifiersProps } from '@/props'

export const VvDialogEvents = [
    'open',
    'close',
    'update:modelValue',
    'beforeEnter',
    'afterLeave',
    'enter',
    'afterEnter',
    'enterCancelled',
    'beforeLeave',
    'leave',
    'leaveCancelled',
]

export const VvDialogProps = {
    ...ModifiersProps,
    ...IdProps,
    /**
     * Dialog title
     */
    title: String,
    /**
     * Show / hide dialog programmatically
     */
    modelValue: {
        type: Boolean,
        default: undefined,
    },
    /**
     * Dialog transition
     */
    transition: { type: String, default: 'fade-block' },
    /**
     * Dialog size
     * @deprecated use modifiers instead
     */
    size: String,
    /**
     * Keep open dialog on click outside
     */
    keepOpen: { type: Boolean, default: false },
}
