import VV_MODAL from './constants'

export default {
	id: { type: String, required: true },
	title: String,
	open: Boolean,
	transition: { type: String, default: 'fade-block' },
	size: {
		type: String,
		default: VV_MODAL.SIZES.normal,
		validator: (value: string) =>
			Object.values(VV_MODAL.SIZES).includes(value)
	},
	autoClose: { type: Boolean, default: true }
}
