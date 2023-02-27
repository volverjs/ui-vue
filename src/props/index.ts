import type { PropType } from 'vue'
import type { Option } from '../types/generic'
import type {
	AutoPlacementOptions,
	FlipOptions,
	OffsetOptions,
	ShiftOptions,
	SizeOptions,
} from '../types/floating-ui'
import {
	Placement,
	Position,
	Side,
	AnchorTarget,
	ButtonType,
} from '../constants'

export const LinkProps = {
	/**
	 * The router-link/nuxt-link property, if it is defined the button is rendered as a ruouter-link or nuxt-link.
	 * @see Documentation of [router-link](https://router.vuejs.org/api/#router-link) and [nuxt-link](https://nuxtjs.org/api/components-nuxt-link/)
	 */
	to: {
		type: [String, Object],
	},
	/**
	 * Anchor href
	 */
	href: String,
	/**
	 * Anchor target
	 */
	target: {
		type: String as PropType<`${AnchorTarget}`>,
		validator: (value: AnchorTarget) =>
			Object.values(AnchorTarget).includes(value),
	},
	/**
	 * Anchor rel
	 */
	rel: {
		type: String,
		default: 'noopener noreferrer',
	},
}

export const ValidProps = {
	/**
	 * Valid status
	 */
	valid: Boolean,
	/**
	 * Valid label
	 */
	validLabel: [String, Array],
}

export const InvalidProps = {
	/**
	 * Invalid status
	 */
	invalid: Boolean,
	/**
	 * Invalid label
	 */
	invalidLabel: [String, Array],
}

export const LoadingProps = {
	/**
	 * Loading status
	 */
	loading: Boolean,
	/**
	 * Loading label
	 */
	loadingLabel: {
		type: String,
		default: 'Loading...',
	},
}

export const DisabledProps = {
	/**
	 * Whether the form control is disabled
	 */
	disabled: Boolean,
}

export const SelectedProps = {
	/**
	 * Whether the item is selected
	 */
	selected: Boolean,
}

export const ActiveProps = {
	/**
	 * Whether the item is active
	 */
	active: Boolean,
}

export const PressedProps = {
	/**
	 * Whether the item is pressed
	 */
	pressed: Boolean,
}

export const LabelProps = {
	/**
	 * The item label
	 */
	label: [String, Number],
}

export const ReadonlyProps = {
	/**
	 * The value is not editable
	 */
	readonly: Boolean,
}

export const ModifiersProps = {
	/**
	 * Component BEM modifiers
	 */
	modifiers: [String, Array] as PropType<string | Array<string>>,
}

export const HintProps = {
	hintLabel: { type: String, default: '' },
}

export const OptionsProps = {
	/**
	 * List of options, can be string[] or object[]
	 */
	options: {
		type: Array as PropType<Array<Option | string>>,
		default: () => [],
	},
	/**
	 * Used when options are objects: key to use for option label
	 */
	labelKey: { type: [String, Function], default: 'label' },
	/**
	 * Used when options are objects: key to use for option label
	 */
	valueKey: { type: [String, Function], default: 'value' },
	/**
	 * Used when options are objects: key to use for option disabled
	 */
	disabledKey: { type: [String, Function], default: 'disabled' },
}

export const CountProps = {
	/**
	 * Show character limit
	 */
	count: {
		type: [Boolean, String],
		default: false,
		validator: (value: string) =>
			[true, false, 'limit', 'countdown'].includes(value),
	},
}

export const DebounceProps = {
	/**
	 * Milliseconds to wait before emitting the input event
	 */
	debounce: [Number, String],
}

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
		type: String as PropType<`${Position}`>,
		default: Position.before,
		validation: (value: Position) =>
			Object.values(Position).includes(value),
	},
}

export const TabindexProps = {
	/**
	 * Global attribute tabindex
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex
	 */
	tabindex: { type: [String, Number], default: 0 },
}

export const FloatingLabelProps = {
	/**
	 * If true the label will be floating
	 */
	floating: Boolean,
}

export const UnselectableProps = {
	/**
	 * If true the input will be unselectable
	 */
	unselectable: { type: Boolean, default: true },
}

export const IdProps = {
	/**
	 * Global attribute id
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id
	 */
	id: [String, Number],
}

export const DropdownProps = {
	/**
	 * Dropdown placement
	 */
	placement: {
		type: String as PropType<`${Side}` | `${Placement}`>,
		default: Side.bottom,
		validator: (value: Side & Placement) => {
			return (
				Object.values(Side).includes(value) ||
				Object.values(Placement).includes(value)
			)
		},
	},
	/**
	 * Dropdown show / hide transition name
	 */
	transitionName: {
		type: String,
	},
	/**
	 * Offset of the dropdown from the trigger
	 * @see https://floating-ui.com/docs/offset
	 */
	offset: {
		type: [Number, String, Object] as PropType<
			OffsetOptions | number | string
		>,
		default: 0,
	},
	/**
	 * Move dropdown to the side if there is no space in the default position
	 * @see https://floating-ui.com/docs/shift
	 */
	shift: {
		type: [Boolean, Object] as PropType<ShiftOptions | boolean>,
		default: false,
	},
	/**
	 * Flip dropdown position if there is no space in the default position
	 * @see https://floating-ui.com/docs/flip
	 */
	flip: {
		type: [Boolean, Object] as PropType<FlipOptions | boolean>,
		default: true,
	},
	/**
	 * Size of the dropdown
	 * @see https://floating-ui.com/docs/size
	 */
	size: {
		type: [Boolean, Object] as PropType<SizeOptions | boolean>,
		default: () => ({ padding: 10 }),
	},
	/**
	 * Automatically change the position of the dropdown
	 * @see https://floating-ui.com/docs/autoPlacement
	 */
	autoPlacement: {
		type: [Boolean, Object] as PropType<AutoPlacementOptions | boolean>,
		default: false,
	},
	/**
	 * Add arrow to the dropdown
	 * @see https://floating-ui.com/docs/arrow
	 */
	arrow: {
		type: Boolean,
		default: false,
	},
	/**
	 * Close dropdown on click outside
	 */
	autoClose: {
		type: Boolean,
		default: true,
	},
	/**
	 * Autofocus first item on dropdown open
	 */
	autofocusFirst: {
		type: Boolean,
		default: true,
	},
	/**
	 * Set dropdown width to the same as the trigger
	 */
	triggerWidth: {
		type: Boolean,
	},
}

export const IdNameProps = {
	...IdProps,
	/**
	 * Input / Textarea name
	 * Name of the form control. Submitted with the form as part of a name/value pair
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name
	 */
	name: { type: String, required: true },
}

export const AutofocusProps = {
	/**
	 * Global attribute autofocus
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autofocus
	 */
	autofocus: Boolean,
}

export const AutocompleteProps = {
	/**
	 * Global attribute autocomplete
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
	 */
	autocomplete: { type: String, default: 'off' },
}

export const InputTextareaProps = {
	...IdNameProps,
	...AutofocusProps,
	...AutocompleteProps,
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
	...FloatingLabelProps,
	...LabelProps,
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
}

export const CheckboxRadioProps = {
	...IdNameProps,
	...TabindexProps,
	...ValidProps,
	...InvalidProps,
	...HintProps,
	...DisabledProps,
	...ReadonlyProps,
	...ModifiersProps,
	...LabelProps,
	/**
	 * Input value
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#value
	 */
	value: [String, Number, Boolean],
	/**
	 * Input value
	 */
	modelValue: [Object, Number, Boolean, String],
}

export const CheckboxRadioGroupProps = {
	...ValidProps,
	...InvalidProps,
	...OptionsProps,
	...HintProps,
	...DisabledProps,
	...ReadonlyProps,
	...ModifiersProps,
	...LabelProps,
	/**
	 * Input value
	 */
	modelValue: [String, Array, Boolean, Number, Symbol],
	/**
	 * Input name
	 */
	name: { type: String, required: true },
	/**
	 * If true, the group will be displayed in a vertical column
	 */
	vertical: Boolean,
}

export const ActionProps = {
	...DisabledProps,
	...LabelProps,
	...PressedProps,
	...ActiveProps,
	...LinkProps,
	/**
	 * Button type
	 */
	type: {
		type: String as PropType<`${ButtonType}`>,
		default: ButtonType.button,
		validator: (value: ButtonType) =>
			Object.values(ButtonType).includes(value),
	},
}
