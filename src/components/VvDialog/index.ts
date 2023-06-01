import { IdProps } from '../../props'

export const VvDialogEvents = [
	'open',
	'close',
	'update:modelValue',
	'before-enter',
	'after-leave',
	'enter',
	'after-enter',
	'enter-cancelled',
	'before-leave',
	'leave',
	'leave-cancelled',
]

export const VvDialogProps = {
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
	 */
	size: String,
	/**
	 * Keep open dialog on click outside
	 */
	keepOpen: { type: Boolean, default: false },
}
