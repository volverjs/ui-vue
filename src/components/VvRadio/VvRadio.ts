import type { ExtractPropTypes } from 'vue'
import { ValidProps, ErrorProps } from '../../props'

export const VvRadioProps = {
	...ValidProps,
	...ErrorProps,
	/**
	 * Valore del radio
	 */
	value: null,
	modelValue: { type: [Object, Number, Boolean, String] },
	label: { type: String, default: '' },
	disabled: Boolean,
	readonly: Boolean
}

export const VvRadioEvents = [
	'click',
	'update:modelValue',
	'change',
	'focus',
	'blur'
]

export type VvRadioPropsType = ExtractPropTypes<typeof VvRadioProps>
