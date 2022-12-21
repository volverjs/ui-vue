import type { ExtractPropTypes } from 'vue'
import {
	ValidProps,
	ErrorProps,
	HintProps,
	LoadingProps,
	ModifiersProps,
	LimitProps,
	InputProps,
	DebounceProps
} from '@/props'

export const ICON_POSITIONS = {
	LEFT: 'left',
	RIGHT: 'right'
}

export const WRAP = {
	hard: 'hard',
	soft: 'soft'
}

export default {
	ICON_POSITIONS,
	WRAP
}

export const VvTextareaEvents = ['update:modelValue', 'focus', 'blur']

export const VvTextareaProps = {
	...ValidProps,
	...ErrorProps,
	...HintProps,
	...LoadingProps,
	...ModifiersProps,
	...LimitProps,
	...InputProps,
	...DebounceProps,
	modelValue: {
		type: [String],
		default: null
	},
	cols: { type: Number, default: 50 },
	rows: { type: Number, default: 5 },
	/**
	 * Icon name
	 * @see DsIcon
	 */
	icon: { type: String, default: '' },
	/**
	 * Icon position
	 */
	iconPosition: {
		type: String,
		validation: (value: string) =>
			Object.values(ICON_POSITIONS).includes(value),
		default: ICON_POSITIONS.RIGHT
	},
	/**
	 * If true, the label will be floating
	 */
	floating: Boolean,
	/**
	 * How the text in a text area is to be wrapped.
	 * @see Documentation https://www.w3schools.com/tags/att_textarea_wrap.asp
	 */
	wrap: { type: String, default: WRAP.soft },
	/**
	 * If true, the value of the textarea will be cleared automatically
	 */
	autoclear: Boolean,
	/**
	 * If true, the textarea will be resizable
	 * @description
	 * Il resize è pilotato via css. Al momento è attivo solamente il resize verticale
	 */
	resizable: Boolean
}

export type VvTextareaPropsTypes = ExtractPropTypes<typeof VvTextareaProps>
