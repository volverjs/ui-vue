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

// value
// While a debounced drag waits for its timer the model still holds the previous
// value: what the readout has to follow is the slider itself. The browser draws
// the filled part of the track by itself, so nothing else needs this.
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
// middle of its track, which is what the readout has to show.
const hasValue = computed(() => {
    const parsed = Number.parseFloat(
        String(draggedValue.value ?? localModelValue.value),
    )
    return Number.isNaN(parsed) ? (hasMin.value + hasMax.value) / 2 : parsed
})
const hasFormattedValue = computed(() => {
    const format = propsDefaults.value.formatValue
    return format ? format(hasValue.value) : String(hasValue.value)
})

onMounted(() => {
    const { defaultValue } = propsDefaults.value
    if (props.modelValue === undefined && defaultValue !== undefined) {
        emit('update:modelValue', toNumber(defaultValue, hasValue.value))
    }
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
}
</script>

<template>
    <div :class="bemCssClasses">
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
                v-bind="hasAttrs"
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
