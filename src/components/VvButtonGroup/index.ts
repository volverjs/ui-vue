import { DisabledProps, ModifiersProps, UnselectableProps } from '@/props'

export const VvButtonGroupProps = {
	...ModifiersProps,
	...DisabledProps,
	...UnselectableProps,
	/**
	 * String or String[] of css classes (modifiers) that will be provided to each button'
	 */
	itemModifiers: { type: [String, Array<string>], default: undefined },
	toggle: { type: Boolean, default: false },
	multiple: { type: Boolean, default: false },
	modelValue: { type: [String, Array<string>], default: undefined },
}

export const VvButtonGroupEvents = ['update:modelValue']
