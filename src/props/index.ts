import type { PropType } from 'vue'
import type { VvIconProps } from '@/components/VvIcon'
import type {
    AutoPlacementOptions,
    FlipOptions,
    OffsetOptions,
    ShiftOptions,
    SizeOptions,
} from '@/types/floating-ui'
import type { Option } from '@/types/generic'
import type { NavItem } from '@/types/nav'
import { ACTION_ICONS } from '@/components/VvIcon'
import {
    ActionTag,
    ButtonType,
    Placement,
    Position,
    Side,
    StorageType,
    Strategy,
} from '@/constants'

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
    target: String,
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
    valid: { type: Boolean, default: false },
    /**
     * Valid label
     */
    validLabel: { type: [String, Array], default: undefined },
}

export const InvalidProps = {
    /**
     * Invalid status
     */
    invalid: {
        type: Boolean,
        default: false,
    },
    /**
     * Invalid label
     */
    invalidLabel: { type: [String, Array], default: undefined },
}

export const LoadingProps = {
    /**
     * Loading status
     */
    loading: {
        type: Boolean,
        default: false,
    },
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
    disabled: {
        type: Boolean,
        default: false,
    },
}

export const RequiredProps = {
    /**
     * Whether the form control is required
     */
    required: {
        type: Boolean,
        default: false,
    },
}

export const SelectedProps = {
    /**
     * Whether the item is selected
     */
    selected: {
        type: Boolean,
        default: false,
    },
}

export const ActiveProps = {
    /**
     * Whether the item is active
     */
    active: {
        type: Boolean,
        default: false,
    },
}

export const CurrentProps = {
    /**
     * Whether the item is current
     */
    current: {
        type: Boolean,
        default: false,
    },
}

export const ClearProps = {
    /**
     * If true, the clear button will be shown
     */
    showClearAction: {
        type: Boolean,
        default: false,
    },
    /**
     * VvIcon name for clear button
     * @see VvIcon
     */
    iconClear: {
        type: [String, Object] as PropType<string | VvIconProps>,
        default: ACTION_ICONS.clear,
    },
    /**
     * Label for clear button
     */
    labelClear: {
        type: String,
        default: 'Clear',
    },
}

export const PressedProps = {
    /**
     * Whether the item is pressed
     */
    pressed: {
        type: Boolean,
        default: false,
    },
}

export const LabelProps = {
    /**
     * The item label
     */
    label: {
        type: [String, Number],
        default: undefined,
    },
}

/**
 * Naming and describing a field from outside. The name matters because `label`
 * is optional: with neither, the control the user operates has no accessible
 * name at all.
 *
 * These are declared props and not left to `$attrs` on purpose. An attribute
 * lands on the component's block, so it would name a wrapper the user never
 * touches and leave the control anonymous. Declaring them takes them out of
 * `$attrs` as well, so nothing ends up duplicated on the block, while `class`,
 * `style` and the `data-` hooks a page puts on a field keep addressing it
 * exactly as before. Vue matches the kebab-case attribute to the camelCase
 * prop, so the call site is the usual `<VvSelect aria-label="…" />` and reads
 * the same as it does on `VvInputRange`, which reaches the control by splitting
 * `$attrs` instead.
 */
export const AriaProps = {
    /**
     * Accessible name of the control. Use it when no visible label is drawn:
     * with one on screen, a different `aria-label` replaces the name assistive
     * technology reads and breaks WCAG 2.5.3 (Label in Name).
     */
    ariaLabel: {
        type: String,
        default: undefined,
    },
    /**
     * Ids of the elements whose text names the control, for a name that is
     * already written on the page. Takes precedence over the component's own
     * `label`, per the accessible name computation.
     */
    ariaLabelledby: {
        type: String,
        default: undefined,
    },
    /**
     * Ids of the elements that describe the control, for help text the page
     * already draws elsewhere.
     *
     * Unlike the two above this one does not replace what the component has to
     * say: `aria-describedby` takes a *list* of ids, so a field with a hint of
     * its own appends the hint rather than dropping either. The caller's ids
     * come first, which is the order they are read in.
     */
    ariaDescribedby: {
        type: String,
        default: undefined,
    },
}

export const ReadonlyProps = {
    /**
     * The value is not editable
     */
    readonly: {
        type: Boolean,
        default: false,
    },
}

export const ModifiersProps = {
    /**
     * Component BEM modifiers
     */
    modifiers: {
        type: [String, Array] as PropType<string | string[]>,
        default: undefined,
    },
}

export const HintProps = {
    hintLabel: { type: String, default: '' },
}

export const OptionsProps = {
    /**
     * List of options, can be string[] or object[]
     */
    options: {
        type: Array as PropType<(Option | string)[]>,
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
    debounce: {
        type: [Number, String],
        default: undefined,
    },
}

export const IconProps = {
    /**
     * VvIcon name or props
     * @see VvIcon
     */
    icon: {
        type: [String, Object] as PropType<string | VvIconProps>,
        default: undefined,
    },
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
    floating: {
        type: Boolean,
        default: false,
    },
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
        validator: (value: Side & Placement) =>
            Object.values(Side).includes(value)
            || Object.values(Placement).includes(value),
    },
    /**
     * Dropdown strategy
     */
    strategy: {
        type: String as PropType<`${Strategy}`>,
        default: undefined,
        validator: (value: Strategy) => Object.values(Strategy).includes(value),
    },
    /**
     * Dropdown show / hide transition name
     */
    transitionName: {
        type: String,
        default: undefined,
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
     * Keep open dropdown on click outside
     */
    keepOpen: {
        type: Boolean,
        default: false,
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
        default: false,
    },
    /**
     * Render the dropdown in the top layer through the Popover API, so that it is
     * not trapped by the stacking context nor clipped by the overflow of an
     * ancestor. Ignored by browsers without the Popover API, which fall back to
     * the in-flow rendering.
     *
     * It implies the `fixed` strategy, because an element in the top layer is
     * positioned against the viewport, and with it the `animationFrame` update of
     * floating-ui: the dropdown stops moving with the scroll of an ancestor, so
     * its position has to be recomputed on every frame while it is open.
     *
     * Needs `@volverjs/style` >= 0.1.25, which neutralizes the user agent styles
     * applied to `[popover]` elements: without it the promoted dropdown keeps the
     * user agent border, padding and background.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Popover_API
     */
    topLayer: {
        type: Boolean,
        default: false,
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
    autofocus: {
        type: Boolean,
        default: false,
    },
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
    ...AriaProps,
    /**
     * Input / Textarea minlength
     * Minimum length (number of characters) of value
     * Available for input types: text, search, url, tel, email, password
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#minlength
     */
    minlength: { type: [String, Number], default: undefined },
    /**
     * Input / Textarea maxlength
     * Maximum length (number of characters) of value
     * Available for input types: text, search, url, tel, email, password
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#maxlength
     */
    maxlength: { type: [String, Number], default: undefined },
    /**
     * Input / Textarea placeholder
     * Text that appears in the form control when it has no value set
     * Available for input types: text, search, url, tel, email, password, number
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#placeholder
     */
    placeholder: {
        type: String,
        default: undefined,
    },
    /**
     * Input / Textarea required
     * A value is required or must be check for the form to be submittable
     * Available for all input types except color
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#required
     */
    ...RequiredProps,
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
    ...LoadingProps,
    /**
     * Input value
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#value
     */
    value: {
        type: [String, Number, Boolean],
        default: undefined,
    },
    /**
     * Input value
     */
    modelValue: {
        type: [Object, Number, Boolean, String],
        default: undefined,
    },
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
    ...LoadingProps,
    ...RequiredProps,
    /**
     * Input value
     */
    modelValue: {
        type: [String, Array, Boolean, Number, Symbol],
        default: undefined,
    },
    /**
     * Input name
     */
    name: { type: String, required: true },
    /**
     * If true, the group will be displayed in a vertical column
     */
    vertical: {
        type: Boolean,
        default: false,
    },
}

export const ActionProps = {
    ...DisabledProps,
    ...LabelProps,
    ...PressedProps,
    ...ActiveProps,
    ...CurrentProps,
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
    /**
     * Button aria-label
     */
    ariaLabel: {
        type: String,
        default: undefined,
    },
    /**
     * Default tag for the action
     */
    defaultTag: {
        type: String,
        default: ActionTag.button,
    },
}

export const NavProps = {
    items: {
        type: Array as PropType<NavItem[]>,
        default: () => [],
    },
}

export const StorageProps = {
    /**
     * Storage type
     * @default StorageType.local
     */
    storageType: {
        type: String as PropType<`${StorageType}`>,
        default: StorageType.local,
        validator: (value: StorageType) =>
            Object.values(StorageType).includes(value),
    },
    /**
     * Storage key
     */
    storageKey: String,
}
