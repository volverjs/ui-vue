import { DisabledProps, ModifiersProps } from '@/props'

export const VvButtonGroupProps = {
	...ModifiersProps,
	...DisabledProps,
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
	 * Active button (name)
	 */
	modelValue: { type: String, default: undefined }
}

export const VvButtonGroupEvents = ['update:modelValue']
