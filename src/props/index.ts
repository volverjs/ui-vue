export const ValidProps = {
	valid: Boolean,
	validLabel: [String, Array]
}

export const ErrorProps = {
	error: Boolean,
	errorLabel: [String, Array]
}

export const LoadingProps = {
	loading: Boolean,
	loadingLabel: String
}

export const ModifiersProps = {
	modifiers: [String, Array]
}

export const HintProps = {
	hintLabel: { type: String, default: '' }
}

export const OptionsProps = {
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
	optionValue: { type: [String, Function], default: () => 'value' }
}
