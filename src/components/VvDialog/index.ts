export const VvDialogEvents = ['open', 'close', 'update:modelValue']

export const VvDialogProps = {
	id: { type: String, required: true },
	title: String,
	modelValue: Boolean,
	transition: { type: String, default: 'fade-block' },
	size: String,
	autoClose: { type: Boolean, default: true },
}
