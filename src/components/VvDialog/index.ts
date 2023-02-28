import { IdProps } from '../../props'

export const VvDialogEvents = ['open', 'close', 'update:modelValue']

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
	 * Close dialog on click outside
	 */
	autoClose: { type: Boolean, default: true },
}
