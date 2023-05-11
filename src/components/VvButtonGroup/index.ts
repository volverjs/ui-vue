import { DisabledProps, ModifiersProps, UnselectableProps } from '../../props'

export const VvButtonGroupProps = {
	...ModifiersProps,
	...DisabledProps,
	...UnselectableProps,
	/**
	 * String or String[] of css classes (modifiers) that will be provided to each button'
	 */
	itemModifiers: {
		type: [String, Array] as PropType<string | string[]>,
		default: '',
	},
	toggle: { type: Boolean, default: false },
	multiple: { type: Boolean, default: false },
	modelValue: {
		type: [String, Number, Boolean, Array] as PropType<
			| string
			| number
			| boolean
			| (string | number | boolean)[]
			| undefined
		>,
		default: undefined,
	},
}

export const VvButtonGroupEvents = ['update:modelValue']
