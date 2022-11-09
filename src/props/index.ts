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

export const DisabledProps = {
	disabled: Boolean
}

export const ReadonlyProps = {
	readonly: Boolean
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

export const LimitProps = {
	/**
	 * Se true, attiva il conteggio caratteri
	 */
	showLimit: Boolean,
	/**
	 * Modalità conteggio
	 * @description
	 * mode="limit", mostra quanti caratteri ho digitato sin ora e qualì'è la maxlength.
	 * mode="countdown", mostra quanti caratteri mancano per raggiungere la maxlength.
	 */
	showLimitMode: {
		type: String,
		default: 'limit',
		validator: (value: string) => ['limit', 'countdown'].includes(value)
	}
}

export const InputProps = {
	id: String,
	name: { type: String, required: true },
	autocomplete: { type: String, default: 'off' },
	autofocus: Boolean,
	minlength: Number,
	maxlength: Number,
	label: String,
	placeholder: String,
	required: Boolean,
	disabled: Boolean,
	readonly: Boolean
}

export const DebounceProps = {
	/**
	 * Debounce time (millisecondi)
	 * @descrition
	 * Tempo che deve passare dall'ultima battuta prima che modelValue venga aggiornato.
	 */
	debounce: Number
}
