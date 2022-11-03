import {
	ValidProps,
	ErrorProps,
	OptionsProps,
	HintProps
} from '../common/Props'

export const VvRadioGroupEvents = ['update:modelValue']

export const VvRadioGroupProps = {
	...ValidProps,
	...ErrorProps,
	...OptionsProps,
	...HintProps,
	/**
	 * VModel
	 */
	modelValue: null,
	label: { type: String, default: '' },
	/**
	 * Nome da utilizzare per il radio group
	 */
	name: { type: String, default: '', required: true },
	disabled: { type: Boolean, default: false },
	readonly: { type: Boolean, default: false },
	/**
	 * True = show buttons vertically
	 */
	vertical: { type: Boolean, default: false }
}
