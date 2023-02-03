import {
	ValidProps,
	InvalidProps,
	HintProps,
	LoadingProps,
	DisabledProps,
	ReadonlyProps,
	ModifiersProps,
	TabindexProps,
	OptionsProps,
	IconProps,
	IdNameProps,
	FloatingLabelProps,
	UnselectableProps,
	AutofocusProps,
	AutocompleteProps,
	LabelProps,
} from '@/props'

export const VvSelectProps = {
	...IdNameProps,
	...AutofocusProps,
	...AutocompleteProps,
	...TabindexProps,
	...ValidProps,
	...InvalidProps,
	...HintProps,
	...LoadingProps,
	...DisabledProps,
	...ReadonlyProps,
	...ModifiersProps,
	...OptionsProps,
	...IconProps,
	...FloatingLabelProps,
	...UnselectableProps,
	...LabelProps,
	/**
	 * This Boolean attribute indicates that multiple options can be selected in the list.
	 * If it is not specified, then only one option can be selected at a time.
	 * When multiple is specified, most browsers will show a scrolling list box instead of a single line dropdown.
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#attr-multiple
	 */
	multiple: Boolean,
	/**
	 * A Boolean attribute indicating that an option with a non-empty string value must be selected.
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#attr-required
	 */
	required: Boolean,
	/**
	 * If the control is presented as a scrolling list box (e.g. when multiple is specified),
	 * this attribute represents the number of rows in the list that should be visible at one time.
	 * Browsers are not required to present a select element as a scrolled list box. The default value is 0.
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#attr-size
	 */
	size: [String, Number],
	/**
	 * modelValue can be a string, number, boolean, object or array of string, number, boolean, object
	 */
	modelValue: {
		type: [String, Number, Boolean, Object, Array],
		default: undefined,
	},
	/**
	 * Select placeholder
	 */
	placeholder: String,
}

export const VvSelectEmits = ['update:modelValue', 'focus', 'blur']
