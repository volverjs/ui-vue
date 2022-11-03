import { ValidProps, ErrorProps, HintProps, OptionsProps } from '../../props'

export const VvCheckGroupProps = {
	...ValidProps,
	...ErrorProps,
	...HintProps,
	...OptionsProps,
	/**
	 * VModel
	 */
	modelValue: { type: Array },
	/**
	 * Radio group label
	 */
	label: { type: String, default: '' },
	/**
	 * Nome da utilizzare per il radio group
	 */
	name: { type: String, default: '', required: true },
	/**
	 * True se disabilitato
	 */
	disabled: { type: Boolean, default: false },
	/**
	 * True se readonly
	 */
	readonly: { type: Boolean, default: false },
	/**
	 * True = show buttons vertically
	 */
	vertical: { type: Boolean, default: false }
}

export const VvCheckGroupEvents = ['update:modelValue', 'change']
