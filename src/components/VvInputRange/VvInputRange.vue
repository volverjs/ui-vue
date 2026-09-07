<script setup lang="ts">
import type { InputHTMLAttributes } from 'vue'
import { VvInputRangeEvents, VvInputRangeProps } from '.'
import HintSlotFactory from '../common/HintSlot'

// props, emit and slots
const props = defineProps(VvInputRangeProps)

const emit = defineEmits(VvInputRangeEvents)

const slots = useSlots()

// props merged with volver defaults
const propsDefaults = useDefaults<typeof VvInputRangeProps>(
    'VvInputRange',
    VvInputRangeProps,
    props,
)

// template refs
const inputEl = ref<HTMLInputElement>()

// data
const {
    id,
    label,
    modelValue,
    valid,
    invalid,
    loading,
    modifiers,
    debounce,
} = toRefs(props)
const hasId = useUniqueId(id)
const hasHintId = computed(() => `${hasId.value}-hint`)

// debounce
// Dragging the thumb walks through every step it passes: a debounce keeps the
// parent from re-rendering on each one of them.
const { model: localModelValue, flush: flushModelValue } = useDebouncedInput(
    modelValue,
    emit,
    debounce,
    {
        setter: (value) => {
            const parsed = Number.parseFloat(String(value))
            return Number.isNaN(parsed) ? value : parsed
        },
    },
)

defineExpose({
    /**
     * Emit a debounced value immediately, without waiting for its timer, and
     * return it. Useful before reading the model on a custom submit.
     */
    flush: flushModelValue,
})

// bounds
function toNumber(value: number | string | undefined, fallback: number) {
    const parsed = Number.parseFloat(String(value))
    return Number.isNaN(parsed) ? fallback : parsed
}
const hasMin = computed(() => toNumber(propsDefaults.value.min, 0))
const hasMax = computed(() => toNumber(propsDefaults.value.max, 100))
const hasStep = computed(() => propsDefaults.value.step)
const hasShowValue = computed(() => propsDefaults.value.showValue)
const hasUnit = computed(() => propsDefaults.value.unit)

// The step the native control snaps to: 1 when the prop is not set, none at
// all on "any", which is the only value that leaves the slider continuous.
const hasSnap = computed(() => {
    const { step } = propsDefaults.value
    if (step === undefined) {
        return 1
    }
    if (String(step) === 'any') {
        return 0
    }
    const parsed = Number.parseFloat(String(step))
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
})

/**
 * The number of decimals to keep, so that snapping a fractional step does not
 * surface the error of the binary representation in the readout.
 */
function decimalsOf(value: number) {
    const text = String(value)
    if (text.includes('e')) {
        return 0
    }
    const separator = text.indexOf('.')
    return separator === -1 ? 0 : text.length - separator - 1
}
const hasPrecision = computed(() =>
    Math.max(decimalsOf(hasMin.value), decimalsOf(hasSnap.value)),
)

/**
 * The value the thumb sits on: the native control clamps what it is given to
 * its bounds and snaps it to the step counted from `min`, so a model out of
 * range or off the step would otherwise read one value and show another.
 */
function normalize(value: number) {
    if (hasMax.value <= hasMin.value) {
        return hasMin.value
    }
    const clamped = Math.min(Math.max(value, hasMin.value), hasMax.value)
    if (!hasSnap.value) {
        return clamped
    }
    const steps = Math.round((clamped - hasMin.value) / hasSnap.value)
    const snapped = hasMin.value + steps * hasSnap.value
    return Number(
        (snapped > hasMax.value ? snapped - hasSnap.value : snapped).toFixed(
            hasPrecision.value,
        ),
    )
}

// value
// While a debounced drag waits for its timer the model still holds the previous
// value: what the readout and the fill have to follow is the slider itself.
const draggedValue = ref<number>()
function onInput(event: Event) {
    draggedValue.value = Number.parseFloat(
        (event.target as HTMLInputElement).value,
    )
}
watch(
    () => props.modelValue,
    () => {
        draggedValue.value = undefined
    },
)

// A range input has no empty state: with no value of its own it reports the
// middle of its track, and both the fill and the readout have to say the same.
const hasValue = computed(() => {
    const parsed = Number.parseFloat(
        String(draggedValue.value ?? localModelValue.value),
    )
    return normalize(
        Number.isNaN(parsed) ? (hasMin.value + hasMax.value) / 2 : parsed,
    )
})
const hasFormattedValue = computed(() => {
    const format = propsDefaults.value.formatValue
    return format ? format(hasValue.value) : String(hasValue.value)
})

// CSS cannot read the value of a range input, so the filled part of the track
// is drawn from the share this writes on the block element.
const hasProgress = computed(() => {
    if (hasMax.value <= hasMin.value) {
        return '0%'
    }
    const ratio = (hasValue.value - hasMin.value) / (hasMax.value - hasMin.value)
    const percentage = Math.min(Math.max(ratio, 0), 1) * 100
    return `${Math.round(percentage * 100) / 100}%`
})

// The control the component wraps has no empty state: a range with no value of
// its own reports the middle of its track and submits it with the form. A model
// left undefined would then contradict a field that already shows a number, and
// a schema that wants one would reject what the user sees. So the value on the
// track is published on mount, `defaultValue` choosing it in place of the
// middle.
onMounted(() => {
    if (props.modelValue !== undefined) {
        return
    }
    const { defaultValue } = propsDefaults.value
    emit(
        'update:modelValue',
        defaultValue === undefined
            ? hasValue.value
            : normalize(toNumber(defaultValue, hasValue.value)),
    )
})

// focus
const { focused } = useComponentFocus(inputEl, emit)

// visibility
const isVisible = useElementVisibility(inputEl)
watch(isVisible, (newValue) => {
    if (newValue && props.autofocus) {
        focused.value = true
    }
})

// tabindex
const isDisabled = computed(() => props.disabled || props.readonly)
const hasTabindex = computed(() => (isDisabled.value ? -1 : props.tabindex))

// invalid
const isInvalid = computed(() => {
    if (props.invalid === true) {
        return true
    }
    if (props.valid === true) {
        return false
    }
    return undefined
})

// hint
const { HintSlot, hasHintLabelOrSlot, hasInvalidLabelOrSlot, hintSlotScope }
    = HintSlotFactory(propsDefaults, slots)

// styles
const bemCssClasses = useModifiers(
    'vv-input-range',
    modifiers,
    computed(() => ({
        valid: valid.value,
        invalid: invalid.value,
        loading: loading.value,
        disabled: props.disabled,
        readonly: props.readonly,
        focus: focused.value && !isDisabled.value,
    })),
)

// attrs
const hasAttrs = computed(
    () =>
        ({
            'name': props.name,
            'min': hasMin.value,
            'max': hasMax.value,
            'step': hasStep.value,
            'tabindex': hasTabindex.value,
            'disabled': isDisabled.value,
            'aria-invalid': isInvalid.value,
            'aria-describedby': hasHintLabelOrSlot.value
                ? hasHintId.value
                : undefined,
            'aria-errormessage': hasInvalidLabelOrSlot.value
                ? hasHintId.value
                : undefined,
        }) as InputHTMLAttributes,
)

// An `aria-` attribute names or describes the field, so it belongs to the
// control the user operates: left on the block it would name a wrapper, and a
// field used without a visible label would stay unnamed. Everything else keeps
// addressing the block, where `class`, `style` and the `data-` hooks a page
// puts on a field are expected to land.
const attrs = useAttrs()
const hasInputAttrs = computed(() => {
    const toReturn: Record<string, unknown> = {}
    Object.keys(attrs).forEach((key) => {
        if (key.startsWith('aria-')) {
            toReturn[key] = attrs[key]
        }
    })
    return { ...toReturn, ...hasAttrs.value }
})
const hasRootAttrs = computed(() => {
    const toReturn = { ...attrs }
    Object.keys(toReturn).forEach((key) => {
        if (key.startsWith('aria-')) {
            delete toReturn[key]
        }
    })
    delete toReturn.class
    delete toReturn.style
    return toReturn
})
const hasRootClass = computed(() => [bemCssClasses.value, attrs.class])
const hasRootStyle = computed(() => [
    { '--input-range-progress': hasProgress.value },
    attrs.style,
])

// slots props
const slotProps = computed(() => ({
    valid: props.valid,
    invalid: props.invalid,
    modelValue: props.modelValue,
    hintLabel: props.hintLabel,
    min: hasMin.value,
    max: hasMax.value,
    unit: hasUnit.value,
    value: hasValue.value,
    formattedValue: hasFormattedValue.value,
}))
</script>

<script lang="ts">
export default {
    name: 'VvInputRange',
    inheritAttrs: false,
}
</script>

<template>
    <div v-bind="hasRootAttrs" :class="hasRootClass" :style="hasRootStyle">
        <label v-if="label" :for="hasId" class="vv-input-range__label">
            {{ label }}
        </label>
        <div class="vv-input-range__wrapper">
            <div v-if="$slots.before" class="vv-input-range__input-before">
                <!-- @slot Slot before the slider -->
                <slot name="before" v-bind="slotProps" />
            </div>
            <input
                :id="hasId"
                ref="inputEl"
                v-model="localModelValue"
                type="range"
                v-bind="hasInputAttrs"
                @input="onInput"
                @change="emit('change', $event)"
            >
            <div v-if="hasShowValue" class="vv-input-range__value">
                <!-- @slot Slot to replace the value readout -->
                <slot name="value" v-bind="slotProps">
                    {{ hasFormattedValue }}
                    <span v-if="hasUnit" class="vv-input-range__unit">
                        {{ hasUnit }}
                    </span>
                </slot>
            </div>
            <div v-if="$slots.after" class="vv-input-range__input-after">
                <!-- @slot Slot after the value -->
                <slot name="after" v-bind="slotProps" />
            </div>
        </div>
        <HintSlot :id="hasHintId" class="vv-input-range__hint">
            <template v-if="$slots.hint" #hint>
                <slot name="hint" v-bind="hintSlotScope" />
            </template>
            <template v-if="$slots.loading" #loading>
                <slot name="loading" v-bind="hintSlotScope" />
            </template>
            <template v-if="$slots.valid" #valid>
                <slot name="valid" v-bind="hintSlotScope" />
            </template>
            <template v-if="$slots.invalid" #invalid>
                <slot name="invalid" v-bind="hintSlotScope" />
            </template>
        </HintSlot>
    </div>
</template>
