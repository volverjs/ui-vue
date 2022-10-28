import { VV_DIALOG_SIZES } from './constants'

export const VvDialogEvents = ['open', 'close', 'update:open']

export const VvDialogProps = {
	id: { type: String, required: true },
	title: String,
	open: Boolean,
	transition: { type: String, default: 'fade-block' },
	size: {
		type: String,
		default: VV_DIALOG_SIZES.normal,
		validator: (value: string) =>
			Object.values(VV_DIALOG_SIZES).includes(value)
	},
	autoClose: { type: Boolean, default: true }
}
