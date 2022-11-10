export const VvButtonGroupProps = {
	disabled: { type: Boolean, default: false },
	/**
	 * True = show buttons vertically
	 */
	vertical: { type: Boolean, default: false },
	/**
	 * True = no padding between buttons
	 */
	compact: { type: Boolean, default: false },
	/**
	 * True = il button group si comporterà come un toggle, materrà attivo l'ultimo pulsante cliccato.
	 */
	toggle: { type: Boolean, default: false },
	/**
	 * True = display as block
	 */
	block: { type: Boolean, default: false },
	/**
	 * True = display btn-broup as rounded (first and last child .vv-button)
	 */
	rounded: { type: Boolean, default: false },
	/**
	 * Button action mode
	 */
	action: Boolean,
	/**
	 * Button action mode
	 */
	actionQuiet: Boolean,
	/**
	 * Active button (name)
	 */
	modelValue: { type: String, default: undefined }
}

export const VvButtonGroupEvents = ['update:modelValue']
