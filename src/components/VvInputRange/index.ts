import type { ExtractPropTypes, PropType } from 'vue'
import {
    AutofocusProps,
    DebounceProps,
    DisabledProps,
    HintProps,
    IdNameProps,
    InvalidProps,
    LabelProps,
    LoadingProps,
    ModifiersProps,
    ReadonlyProps,
    TabindexProps,
    ValidProps,
} from '../../props'

export const VvInputRangeEvents = [
    'update:modelValue',
    'focus',
    'blur',
    'change',
]

export const VvInputRangeProps = {
    ...IdNameProps,
    ...AutofocusProps,
    ...TabindexProps,
    ...DisabledProps,
    ...ReadonlyProps,
    ...ValidProps,
    ...InvalidProps,
    ...HintProps,
    ...LoadingProps,
    ...ModifiersProps,
    ...DebounceProps,
    ...LabelProps,
    /**
     * Input value
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range#value
     */
    modelValue: {
        type: [Number, String],
        default: undefined,
    },
    /**
     * The most negative value the slider accepts
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range#min
     */
    min: {
        type: [Number, String],
        default: 0,
    },
    /**
     * The greatest value the slider accepts
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range#max
     */
    max: {
        type: [Number, String],
        default: 100,
    },
    /**
     * The granularity the value must adhere to
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range#step
     */
    step: {
        type: [Number, String],
        default: undefined,
    },
    /**
     * The value published on mount when `modelValue` is undefined, in place of
     * the middle of the track. A range input has no empty state, so the field
     * always starts on a value and always reports it.
     */
    defaultValue: {
        type: [Number, String],
        default: undefined,
    },
    /**
     * If true, the current value is shown next to the slider
     */
    showValue: {
        type: Boolean,
        default: true,
    },
    /**
     * Unit of measure shown next to the value
     */
    unit: {
        type: String,
        default: undefined,
    },
    /**
     * Format the value shown next to the slider, e.g. to localize it
     */
    formatValue: {
        type: Function as PropType<(value: number) => string>,
        default: undefined,
    },
}

export type VvInputRangePropsTypes = ExtractPropTypes<typeof VvInputRangeProps>
