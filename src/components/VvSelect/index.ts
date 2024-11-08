import type { MaybeElement } from '@vueuse/core'
import type { Option } from '../../types/generic'
import {
    AutocompleteProps,
    AutofocusProps,
    DisabledProps,
    FloatingLabelProps,
    HintProps,
    IconProps,
    IdNameProps,
    InvalidProps,
    LabelProps,
    LoadingProps,
    ModifiersProps,
    OptionsProps,
    ReadonlyProps,
    TabindexProps,
    UnselectableProps,
    ValidProps,
} from '../../props'

export type VvSelectEmits = {
    'update:modelValue': [any]
    'focus': [MaybeElement]
    'blur': [MaybeElement]
}

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
     * Select first option automatically
     */
    autoselectFirst: {
        type: Boolean,
        default: false,
    },
    /**
     * Select placeholder
     */
    placeholder: String,
}

// WARNING: This is a provisiaonal implementation, it may change in the future
export function useVvSelectProps<T extends Option | string>() {
    return {
        ...VvSelectProps,
        options: {
            ...VvSelectProps.options,
            type: Array as PropType<T[]>,
            default: () => [],
        },
    }
}
