import { ValidProps, ErrorProps, HintProps, OptionsProps } from '@/props'

export const VvCheckboxGroupProps = {
	...ValidProps,
	...ErrorProps,
	...HintProps,
	...OptionsProps,
	/**
	 * Input value
	 */
	modelValue: { type: Array },
	/**
	 * Input label
	 */
	label: { type: String, default: '' },
	/**
	 * Input name
	 */
	name: { type: String, default: '', required: true },
	/**
	 * If true, the input will be disabled
	 */
	disabled: { type: Boolean, default: false },
	/**
	 * If true, the input will be readonly
	 */
	readonly: { type: Boolean, default: false },
	/**
	 * If true, the group will be displayed in a vertical column
	 */
	vertical: { type: Boolean, default: false }
}

export const VvCheckboxGroupEvents = ['update:modelValue', 'change']
