export const VvRadioGroupEvents = ['update:modelValue']

export const VvRadioGroupProps = {
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
	vertical: { type: Boolean, default: false },
	/**
	 * Lista delle radio options
	 */
	options: { type: Array, default: () => [] },
	/**
	 * Se options è un array di oggetti, optionLabel = nome del campo da utilizzare come label oppure una funzione per ricavare la label
	 */
	optionLabel: { type: [String, Function], default: () => 'label' },
	/**
	 * Se options è un array di oggetti, optionValue = nome del campo da utilizzare come value oppure una funzione per ricavare il value
	 */
	optionValue: { type: [String, Function], default: () => 'value' },
	hintLabel: { type: String, default: '' },
	valid: Boolean,
	validLabel: [String, Array],
	error: Boolean,
	errors: [String, Array]
}
