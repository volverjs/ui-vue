import {
	ValidProps,
	ErrorProps,
	HintProps,
	LoadingProps,
	DisabledProps,
	ReadonlyProps,
	ModifiersProps
} from '../../props'
import { ICON_POSITIONS, WRAP } from './constants'

export const VvTextareaEvents = ['update:modelValue', 'focus', 'blur']

export const VvTextareaProps = {
	...ValidProps,
	...ErrorProps,
	...HintProps,
	...LoadingProps,
	...DisabledProps,
	...ReadonlyProps,
	...ModifiersProps,
	modelValue: null,
	id: String,
	name: { type: String, required: true },
	autocomplete: { type: String, default: 'off' },
	autofocus: Boolean,
	minlength: Number,
	maxlength: Number,
	label: String,
	placeholder: String,
	required: Boolean,
	/**
	 * Nome dell'icona
	 * @see DsIcon
	 */
	icon: { type: String, default: '' },
	/**
	 * Posizione dell'icona
	 */
	iconPosition: {
		type: String,
		validation: (value: string) =>
			Object.values(ICON_POSITIONS).includes(value),
		default: ICON_POSITIONS.RIGHT
	},
	/**
	 * True = label flottante
	 */
	floating: Boolean,
	debounce: Number,
	cols: { type: Number, default: 50 },
	rows: { type: Number, default: 5 },
	/**
	 * Specifica come il testo sarà wrappato
	 * @see Documentation https://www.w3schools.com/tags/att_textarea_wrap.asp
	 */
	wrap: { type: String, default: WRAP.soft },
	/**
	 * Se true, attiva il conteggio caratteri
	 */
	showLimit: Boolean,
	showLimitMode: {
		type: String,
		default: 'limit',
		validator: (value: string) => ['limit', 'countdown'].includes(value)
	},
	/**
	 * Se true, attiva la possibilità di cancellare il testo nella textarea
	 */
	autoclear: Boolean,
	/**
	 * Se true, la textbox può essere ridimensionata verticalmente.
	 * @description
	 * Il resize è pilotato via css. Al momento è attivo solamente il resize verticale
	 */
	resizable: Boolean
}
