import type { MaybeElement } from '@vueuse/core'
import type { PropType } from 'vue'
import type { Option } from '../../types/generic'
import {
    DisabledProps,
    DropdownProps,
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
    ValidProps,
} from '../../props'

export type VvComboboxEvents = {
    'update:modelValue': [any]
    'update:search': [string]
    /**
     * @deprecated use update:search instead
     */
    'change:search': [string]
    'focus': [MaybeElement]
    'blur': [MaybeElement]
}

export const VvComboboxProps = {
    ...IdNameProps,
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
    ...DropdownProps,
    ...LabelProps,
    /**
     * Dropdown show / hide transition name
     */
    transitionName: {
        type: String,
        default: 'vv-dropdown--mobile-fade-block',
    },
    /**
     * modelValue can be a string, number, boolean, object or array of string, number, boolean, object
     */
    modelValue: {
        type: [String, Number, Boolean, Object, Array],
        default: undefined,
    },
    /**
     * Label for no search results
     */
    noResultsLabel: { type: String, default: 'No results' },
    /**
     * Label for no options	available
     */
    noOptionsLabel: { type: String, default: 'No options available' },
    /**
     * Label for selected option hint
     */
    selectedHintLabel: { type: String, default: 'Selected' },
    /**
     * Label for deselect action button
     */
    deselectActionLabel: { type: String, default: 'Deselect' },
    /**
     * Label for select option hint
     */
    selectHintLabel: { type: String, default: 'Press enter to select' },
    /**
     * Label for deselected option hint
     */
    deselectHintLabel: { type: String, default: 'Press enter to remove' },
    /**
     * Label close button
     */
    closeLabel: { type: String, default: 'Close' },
    /**
     * Select input placeholder
     */
    placeholder: String,
    /**
     * Use input text to search on options
     */
    searchable: Boolean,
    /**
     * Search function to filter options
     */
    searchFunction: {
        type: Function as PropType<
            (
                search: string,
                options: (Option | string)[],
            ) => (Option | string)[] | Promise<(Option | string)[]>
        >,
        default: undefined,
    },
    /**
     * On searchable select is the input search placeholder
     */
    searchPlaceholder: {
        type: String,
        default: 'Search...',
    },
    /**
     * The input search debounce time in ms
     */
    debounceSearch: {
        type: [Number, String],
        default: 0,
    },
    /**
     * Manage modelValue as string[] or object[]
     */
    multiple: Boolean,
    /**
     * The min number of selected values
     */
    minValues: {
        type: [Number, String],
        default: 0,
    },
    /**
     * The max number of selected values
     */
    maxValues: [Number, String],
    /**
     * If true the input will be unselectable
     * @deprecated use minValues instead
     */
    unselectable: { type: Boolean, default: true },
    /**
     * The select label separator visible to the user
     */
    separator: { type: String, default: ', ' },
    /**
     * Show native select
     */
    native: Boolean,
    /**
     * Show badges
     */
    badges: Boolean,
    /**
     * Badge modifiers
     */
    badgeModifiers: {
        type: [String, Array] as PropType<string | string[]>,
        default: 'action sm',
    },
    /**
     * Set dropdown width to the same as the trigger
     */
    triggerWidth: {
        ...DropdownProps.triggerWidth,
        default: true,
    },
    /**
     * Dropdown modifiers
     */
    dropdownModifiers: {
        type: [String, Array] as PropType<string | string[]>,
        default: 'mobile',
    },
    /**
     * Open dropdown on focus
     */
    autoOpen: {
        type: Boolean,
        default: false,
    },
    /**
     * Select first option automatically
     */
    autoselectFirst: {
        type: Boolean,
        default: false,
    },
    /**
     * Keep open dropdown on single select
     */
    keepOpen: {
        type: Boolean,
        default: false,
    },
}

// WARNING: This is a provisiaonal implementation, it may change in the future
export function useVvComboboxProps<T extends Option | string>() {
    return {
        ...VvComboboxProps,
        options: {
            ...VvComboboxProps.options,
            type: Array as PropType<T[]>,
        },
        searchFunction: {
            ...VvComboboxProps.searchFunction,
            type: Function as PropType<
                (
                    search: string,
                    options: T[],
                ) => T[] | Promise<T[]>
            >,
        },
    }
}
