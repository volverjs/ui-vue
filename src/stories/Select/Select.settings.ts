import type { ArgTypes } from '@storybook/vue3'
import { VvSelectProps } from '@/components/VvSelect'
import {
    AutocompleteArgTypes,
    AutofocusArgTypes,
    DisabledArgTypes,
    FloatingLabelArgTypes,
    HintArgTypes,
    IconArgTypes,
    IdNameArgTypes,
    InvalidArgTypes,
    LoadingArgTypes,
    ModifiersArgTypes,
    OptionsArgTypes,
    ReadonlyArgTypes,
    TabindexArgTypes,
    UnselectableArgTypes,
    ValidArgTypes,
} from '@/stories/argTypes'

export const defaultArgs = {
    ...propsToObject(VvSelectProps),
    name: 'vv-select',
    options: ['Option 1', 'Option 2', 'Option 3'],
    placeholder: 'Select an option',
    label: 'Select label',
}
export const argTypes: ArgTypes = {
    ...IdNameArgTypes,
    ...AutofocusArgTypes,
    ...AutocompleteArgTypes,
    ...TabindexArgTypes,
    ...ValidArgTypes,
    ...InvalidArgTypes,
    ...HintArgTypes,
    ...LoadingArgTypes,
    ...DisabledArgTypes,
    ...ReadonlyArgTypes,
    ...ModifiersArgTypes,
    ...OptionsArgTypes,
    ...IconArgTypes,
    ...FloatingLabelArgTypes,
    ...UnselectableArgTypes,
    multiple: {
        description:
			'This Boolean attribute indicates that multiple options can be selected in the list.',
        table: {
            defaultValue: {
                summary: 'false',
            },
        },
    },
    required: {
        description:
			'A Boolean attribute indicating that an option with a non-empty string value must be selected.',
        table: {
            defaultValue: {
                summary: 'false',
            },
        },
    },
    size: {
        description:
			'If the control is presented as a scrolling list box this attribute represents the number of rows in the list.',
        control: {
            type: 'text',
        },
    },
    label: {
        description: '<label> value for the select',
        control: {
            type: 'text',
        },
    },
    placeholder: {
        description: 'Text that appears when it has no value set.',
        control: {
            type: 'text',
        },
    },
}
