import { DisabledProps, ModifiersProps } from '@/props'

export const VvButtonGroupProps = {
	...ModifiersProps,
	...DisabledProps,
	/**
	 * String or String[] of css classes (modifiers) that will be provided to each button'
	 */
	itemModifiers: {
		type: [String, Array<string>],
		default: ''
	},
	toggle: { type: Boolean, default: false },
	multiple: { type: Boolean, default: false },
	unselectable: { type: Boolean, default: true },
	modelValue: { type: [String, Array<string>], default: undefined }
}

export const VvButtonGroupEvents = ['update:modelValue']
