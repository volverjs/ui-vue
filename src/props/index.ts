import type { PropType } from 'vue'
import type { Option } from '@/types/generic'

export const ValidProps = {
	valid: Boolean,
	validLabel: [String, Array]
}

export const InvalidProps = {
	invalid: Boolean,
	invalidLabel: [String, Array]
}

export const LoadingProps = {
	loading: Boolean,
	loadingLabel: String
}

export const DisabledProps = {
	/**
	 * Whether the form control is disabled
	 */
	disabled: Boolean
}

export const ReadonlyProps = {
	/**
	 * The value is not editable
	 */
	readonly: Boolean
}

export const ModifiersProps = {
	/**
	 * Component BEM modifiers
	 */
	modifiers: [String, Array] as PropType<string | Array<string>>
}

export const HintProps = {
	hintLabel: { type: String, default: '' }
}

export const OptionsProps = {
	/**
	 * List of options, can be string[] or object[]
	 */
	options: {
		type: Array as PropType<Array<Option | string>>,
		default: () => []
	},
	/**
	 * Used when options are objects: key to use for option label
	 */
	labelKey: { type: [String, Function], default: 'label' },
	/**
	 * Used when options are objects: key to use for option label
	 */
	valueKey: { type: [String, Function], default: 'value' }
}

export const CountProps = {
	/**
	 * Show character limit
	 */
	count: {
		type: [Boolean, String],
		default: false,
		validator: (value: string) =>
			[true, false, 'limit', 'countdown'].includes(value)
	}
}

export const DebounceProps = {
	/**
	 * Milliseconds to wait before emitting the input event
	 */
	debounce: [Number, String]
}

export const ICON_POSITIONS = {
	LEFT: 'left',
	RIGHT: 'right'
} as const
export type IconPosition = ValueOf<typeof ICON_POSITIONS>

export const IconProps = {
	/**
	 * VvIcon name or props
	 * @see VVIcon
	 */
	icon: { type: [String, Object] },
	/**
	 * VvIcon position
	 */
	iconPosition: {
		type: String as PropType<IconPosition>,
		validation: (value: IconPosition) =>
			Object.values(ICON_POSITIONS).includes(value),
		default: ICON_POSITIONS.RIGHT
	}
}

export const TabindexProps = {
	/**
	 * Global attribute tabindex
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
	 */
	tabindex: { type: [String, Number], default: 0 }
}

export const IdNameProps = {
	/**
	 * Global attribute id
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id
	 */
	id: [String, Number],
	/**
	 * Input / Textarea name
	 * Name of the form control. Submitted with the form as part of a name/value pair
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name
	 */
	name: { type: String, required: true }
}

export const InputTextareaProps = {
	...IdNameProps,
	...TabindexProps,
	...DisabledProps,
	...ReadonlyProps,
	...ValidProps,
	...InvalidProps,
	...HintProps,
	...LoadingProps,
	...ModifiersProps,
	...CountProps,
	...DebounceProps,
	...IconProps,
	/**
	 * Global attribute autofocus
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autofocus
	 */
	autofocus: Boolean,
	/**
	 * Input / Textarea autocomplete
	 * Hint for for autofill feature
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autocomplete
	 */
	autocomplete: { type: String, default: 'off' },
	/**
	 * Input / Textarea minlength
	 * Minimum length (number of characters) of value
	 * Available for input types: text, search, url, tel, email, password
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#minlength
	 */
	minlength: Number,
	/**
	 * Input / Textarea maxlength
	 * Maximum length (number of characters) of value
	 * Available for input types: text, search, url, tel, email, password
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#maxlength
	 */
	maxlength: Number,
	/**
	 * Input / Textarea placeholder
	 * Text that appears in the form control when it has no value set
	 * Available for input types: text, search, url, tel, email, password, number
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#placeholder
	 */
	placeholder: String,
	/**
	 * Input / Textarea required
	 * A value is required or must be check for the form to be submittable
	 * Available for all input types except color
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#required
	 */
	required: Boolean,
	/**
	 * <label> value for the Input / Textarea
	 */
	label: String,
	/**
	 * If true the label will be floating
	 */
	floating: Boolean
}

export const CheckboxRadioProps = {
	...IdNameProps,
	...TabindexProps,
	...ValidProps,
	...InvalidProps,
	...HintProps,
	...DisabledProps,
	...ReadonlyProps,
	/**
	 * Input value
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#value
	 */
	value: [String, Number, Boolean],
	/**
	 * Input value
	 */
	modelValue: [Object, Number, Boolean, String],
	/**
	 * <label> for input
	 */
	label: String
}

export const CheckboxRadioGroupProps = {
	...ValidProps,
	...InvalidProps,
	...OptionsProps,
	...HintProps,
	...DisabledProps,
	...ReadonlyProps,
	/**
	 * Input value
	 */
	modelValue: [String, Array],
	/**
	 * Input label
	 */
	label: String,
	/**
	 * Input name
	 */
	name: { type: String, required: true },
	/**
	 * If true, the group will be displayed in a vertical column
	 */
	vertical: Boolean
}
