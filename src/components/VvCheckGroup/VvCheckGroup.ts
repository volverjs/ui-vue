export const VvCheckGroupProps = {
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
	/**
	 * Testo help
	 */
	hintLabel: { type: String, default: '' },
	/**
	 * True - valid state
	 */
	valid: Boolean,
	/**
	 * Messaggio custom per un valore valido
	 */
	validLabel: [String, Array],
	/**
	 * True - invalid state.
	 * @default
	 * True (invalid)| False (valid), Null/Undefined (indefinito - non impostato)
	 */
	error: Boolean,
	/**
	 * Messaggi di errore.
	 */
	errors: [String, Array]
}

export const VvCheckGroupEvents = ['update:modelValue', 'change']
