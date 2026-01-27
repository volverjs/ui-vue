<script setup lang="ts">
import type { MaskedNumberOptions } from 'imask'
import type { InputHTMLAttributes } from 'vue'
import type { InputType } from '../VvInputText'
import { useIMask } from 'vue-imask'
import {
    getDateFromInputValue,
    getInputValueFromDate,
    isDateIsoString,
} from '../../utils/DateUtilities'
import HintSlotFactory from '../common/HintSlot'
import VvDropdown from '../VvDropdown/VvDropdown.vue'
import VvDropdownOption from '../VvDropdown/VvDropdownOption.vue'
import { ACTION_ICONS } from '../VvIcon'
import VvIcon from '../VvIcon/VvIcon.vue'
import {
    INPUT_TYPES,
    VvInputTextEvents,
    VvInputTextProps,
} from '../VvInputText'
import VvInputTextActionsFactory from '../VvInputText/VvInputTextActions'

// props, emit, slots and attrs
const props = defineProps(VvInputTextProps)

const emit = defineEmits(VvInputTextEvents)

const slots = useSlots()

// inject plugin
const volver = useVolver()

// props merged with volver defaults (now only for labels)
const propsDefaults = useDefaults<typeof VvInputTextProps>(
    'VvInputText',
    VvInputTextProps,
    props,
)

// data
const {
    count,
    debounce,
    icon,
    iconPosition,
    iconRemoveSuggestion,
    id,
    invalid,
    label,
    labelRemoveSuggestion,
    loading,
    maxlength,
    minlength,
    modelValue,
    step,
    storageType,
    type,
    unit,
    valid,
} = toRefs(props)
const hasId = useUniqueId(id)
const hasHintId = computed(() => `${hasId.value}-hint`)
// BUG: https://www.samanthaming.com/tidbits/88-css-placeholder-shown/
const inputTextPlaceholder = computed(() =>
    props.floating && isEmpty(props.placeholder) ? ' ' : props.placeholder,
)

// debounce
const localModelValue = useDebouncedInput(
    modelValue,
    emit,
    debounce?.value ?? 0,
)

// seconds
const hasSeconds = computed(() => {
    const stepValue = typeof step.value === 'number' ? step.value : Number.parseInt(step.value)
    if (Number.isNaN(stepValue)) {
        return false
    }
    return stepValue % 60 !== 0
})

// mask
const NEGATIVE_ZERO_REGEX = /^-0?[.,]?[0*]?$/
const maskReady = ref(false)
const modelValueDate = ref<Date>()
const modelValueDateIsoString = ref<string>()
const { el, mask, typed, masked, unmasked } = useIMask(
    computed(
        () => {
            if (!props.iMask) {
                return {
                    mask: /./,
                }
            }
            if (props.iMask.mask === Number) {
                const toReturn = { ...props.iMask } as MaskedNumberOptions
                if (props.min) {
                    toReturn.min = Number(props.min)
                }
                if (props.max) {
                    toReturn.max = Number(props.max)
                }
                return toReturn
            }
            return props.iMask
        },
    ),
    {
        emit,
        onAccept: () => {
            if (!maskReady.value) {
                return
            }
            emit('update:masked', masked.value)
            if (type.value === INPUT_TYPES.NUMBER) {
                if (/^-$|^$/.test(unmasked.value)) {
                    if (
                        localModelValue.value === null
                        || localModelValue.value === undefined
                    ) {
                        return
                    }
                    localModelValue.value = undefined
                    return
                }
                if (NEGATIVE_ZERO_REGEX.test(unmasked.value)) {
                    localModelValue.value = 0
                    return
                }
                if (typeof typed.value !== 'number') {
                    localModelValue.value = Number(typed.value)
                    return
                }
                localModelValue.value = typed.value
                return
            }
            if (type.value === INPUT_TYPES.DATETIME_LOCAL
                || type.value === INPUT_TYPES.DATE
                || type.value === INPUT_TYPES.TIME
                || type.value === INPUT_TYPES.MONTH
            ) {
                if (!typed.value) {
                    if (!localModelValue.value) {
                        return
                    }
                    if (modelValueDate.value) {
                        localModelValue.value = undefined
                        return
                    }
                    localModelValue.value = ''
                    return
                }
                if (!(typed.value instanceof Date) && !modelValueDate.value && !modelValueDateIsoString.value) {
                    localModelValue.value = typed.value
                    return
                }

                let date = typed.value
                if (!(date instanceof Date)) {
                    date = getDateFromInputValue(typed.value, type.value)
                }
                if (modelValueDate.value || modelValueDateIsoString.value) {
                    const toReturn = new Date(modelValueDate.value || modelValueDateIsoString.value as string)
                    if (type.value === INPUT_TYPES.DATETIME_LOCAL
                        || type.value === INPUT_TYPES.DATE
                        || type.value === INPUT_TYPES.MONTH
                    ) {
                        toReturn.setFullYear(date.getFullYear())
                        toReturn.setMonth(date.getMonth())
                    }
                    if (type.value === INPUT_TYPES.DATETIME_LOCAL
                        || type.value === INPUT_TYPES.DATE
                    ) {
                        toReturn.setDate(date.getDate())
                    }
                    if (type.value === INPUT_TYPES.DATETIME_LOCAL
                        || type.value === INPUT_TYPES.TIME) {
                        toReturn.setHours(date.getHours())
                        toReturn.setMinutes(date.getMinutes())
                        toReturn.setSeconds(date.getSeconds())
                    }
                    if (modelValueDate.value instanceof Date) {
                        if (localModelValue.value?.getTime() === toReturn.getTime()) {
                            return
                        }
                        localModelValue.value = toReturn
                        return
                    }
                    localModelValue.value = toReturn.toISOString()
                    return
                }
                localModelValue.value = getInputValueFromDate(date, type.value, hasSeconds.value)
                return
            }
            if (!localModelValue.value && !unmasked.value) {
                return
            }
            localModelValue.value = unmasked.value
        },
    },
)
function updateMaskValue(newValue: string | number | Date | undefined | null) {
    // Handle empty values
    if (newValue === undefined || newValue === null) {
        typed.value = ''
        unmasked.value = ''
        return
    }

    // Handle Date mask
    if (props.iMask?.mask === Date) {
        typed.value = newValue instanceof Date ? newValue : new Date(newValue)
        return
    }

    // Handle negative zero for numbers
    if (
        type.value === INPUT_TYPES.NUMBER
        && NEGATIVE_ZERO_REGEX.test(unmasked.value)
        && newValue === 0
    ) {
        return
    }

    // Handle date/time types
    if (isDateTimeLike.value) {
        if (newValue instanceof Date || isDateIsoString(newValue)) {
            // Store the date reference
            if (newValue instanceof Date) {
                modelValueDate.value = newValue
                modelValueDateIsoString.value = undefined
            } else {
                modelValueDateIsoString.value = newValue as string
                modelValueDate.value = undefined
            }

            // Format for display (skip week type as it's not supported by getInputValueFromDate)
            if (type.value !== INPUT_TYPES.WEEK) {
                const newDate = new Date(newValue)
                const dateType = type.value as 'date' | 'time' | 'datetime-local' | 'month'
                typed.value = getInputValueFromDate(newDate, dateType, hasSeconds.value)
                unmasked.value = typed.value
            }
            return
        }

        // Clear date references if not a valid date
        modelValueDate.value = undefined
        modelValueDateIsoString.value = undefined
    }

    // Default case
    typed.value = newValue
    unmasked.value = `${typed.value}`
}
onMounted(() => {
    if (mask.value) {
        maskReady.value = true
        updateMaskValue(props.modelValue)
    }
})
watch(
    () => props.modelValue,
    (newValue) => {
        if (mask.value) {
            updateMaskValue(newValue)
        }
    },
)
watch(
    () => props.masked,
    (newValue) => {
        masked.value = newValue ?? ''
    },
)

// template refs
const inputEl = el as Ref<HTMLInputElement>
const innerEl = ref<HTMLInputElement>()
const wrapperEl = ref<HTMLDivElement>()
const suggestionsDropdownEl = ref<InstanceType<typeof VvDropdown>>()

defineExpose({
    /** Reference to the input element */
    $input: inputEl,
    /** Reference to the inner element */
    $inner: innerEl,
    /** Reference to the wrapper element */
    $wrapper: wrapperEl,
})

// focus
const { focused } = useComponentFocus(inputEl, emit)
const isFocused = computed(
    () => focused.value && !props.disabled && !props.readonly,
)
function handleFocusChange(isFocused: boolean) {
    if (isFocused) {
        handleInputFocus()
    } else {
        handleInputBlur()
    }
}

function handleInputFocus() {
    if (propsDefaults.value.selectOnFocus && inputEl.value) {
        inputEl.value.select()
    }
    if (allSuggestions.value.size) {
        suggestionsDropdownEl.value?.show()
    }
}

function handleInputBlur() {
    if (!isDirty.value || !storageSuggestions.value) {
        return
    }

    const suggestionsLimit = props.maxSuggestions
    const hasValue = localModelValue.value !== undefined && localModelValue.value !== null && localModelValue.value !== ''

    if (!hasValue) {
        return
    }

    // Remove oldest if limit reached and value not already present
    if (
        storageSuggestions.value.size >= suggestionsLimit
        && !storageSuggestions.value.has(localModelValue.value)
    ) {
        storageSuggestions.value = new Set(
            [...storageSuggestions.value].slice(
                storageSuggestions.value.size - suggestionsLimit + 1,
            ),
        )
    }
    storageSuggestions.value.add(localModelValue.value)
}

watch(isFocused, handleFocusChange)

// visibility
const isVisible = useElementVisibility(inputEl)
watch(isVisible, (newValue) => {
    if (newValue && props.autofocus && !props.disabled && !props.readonly) {
        focused.value = true
    }
})

// password
const showPassword = ref(false)
const isPassword = computed(() => props.type === INPUT_TYPES.PASSWORD)
function onTogglePassword() {
    showPassword.value = !showPassword.value
}

// time, datetime and date
const isDateTime = computed(() => isDateTimeLike.value)

// number
const isNumber = computed(() => props.type === INPUT_TYPES.NUMBER)
function onStepUp() {
    if (!isDisabledOrReadonly.value) {
        if (props.iMask) {
            typed.value = Number(typed.value) + Number(step?.value ?? 1)
            return
        }
        inputEl.value.stepUp()
        localModelValue.value = Number(inputEl.value.value)
    }
}
function onStepDown() {
    if (!isDisabledOrReadonly.value) {
        if (props.iMask) {
            typed.value = Number(typed.value) - Number(step?.value ?? 1)
            return
        }
        inputEl.value.stepDown()
        localModelValue.value = Number(inputEl.value.value)
    }
}

// search
const isSearch = computed(() => props.type === INPUT_TYPES.SEARCH)
function onClear() {
    localModelValue.value = ''
    emit('clear')
}

// icons
const { hasIconBefore, hasIconAfter } = useComponentIcon(icon, iconPosition)
const iconAfter = computed(() => {
    if (hasIconAfter.value !== undefined) {
        return hasIconAfter.value
    }
    switch (props.type) {
        case INPUT_TYPES.COLOR:
            return { name: ACTION_ICONS.showColorPicker }
        case INPUT_TYPES.DATE:
        case INPUT_TYPES.DATETIME_LOCAL:
        case INPUT_TYPES.WEEK:
        case INPUT_TYPES.MONTH:
            return { name: ACTION_ICONS.showDatePicker }
        case INPUT_TYPES.TIME:
            return { name: ACTION_ICONS.showTimePicker }
    }
    return undefined
})
const { hasIcon: hasIconRemoveSuggestion }
    = useComponentIcon(iconRemoveSuggestion)

// count
const { formatted: countFormatted } = useTextCount(localModelValue, {
    mode: count.value,
    upperLimit: Number(maxlength?.value),
    lowerLimit: Number(minlength?.value),
})

// tabindex
const isDisabledOrReadonly = computed(() => props.disabled || props.readonly)
const hasTabindex = computed(() => {
    return isDisabledOrReadonly.value ? -1 : props.tabindex
})

// dirty
const isDirty = computed(() => !isEmpty(modelValue?.value))

// invalid
const isInvalid = computed(() => {
    if (invalid.value === true) {
        return true
    }
    if (valid.value === true) {
        return false
    }
    return undefined
})

// suggestions
const storageKey = computed(() => props.storageKey ?? (volver?.experimentalFeatures.forceInputSuggestions ? props.name : undefined))
const storageSuggestions = usePersistence<Set<string | number | Date>>(
    storageKey,
    storageType,
    new Set(),
)
const allSuggestions = computed(() => {
    const merged = new Map<string | number | Date, { isFromStorage: boolean }>()

    // Add storage suggestions
    if (storageSuggestions.value) {
        for (const suggestion of storageSuggestions.value) {
            merged.set(suggestion, { isFromStorage: true })
        }
    }

    // Add external suggestions (overwrite if exists, mark as not from storage)
    if (props.suggestions) {
        for (const suggestion of props.suggestions) {
            merged.set(suggestion, { isFromStorage: false })
        }
    }

    return merged
})
const filteredSuggestions = computed(() => {
    if (allSuggestions.value.size === 0) {
        return []
    }
    return [...allSuggestions.value.entries()]
        .filter(
            ([suggestion]) =>
                isEmpty(localModelValue.value)
                || (`${suggestion}`
                    .toLowerCase()
                    .includes(`${localModelValue.value}`.toLowerCase())
                    && suggestion !== localModelValue.value),
        )
        .reverse()
        .map(([suggestion]) => suggestion)
})
const hasSuggestions = computed(
    () =>
        allSuggestions.value.size > 0,
)
function onSuggestionSelect(suggestion: string | number | Date) {
    localModelValue.value = suggestion
    suggestionsDropdownEl.value?.hide()
    emit('suggestion:selected', suggestion)
}
function onSuggestionRemove(suggestion: string | number | Date) {
    // Only remove from storage if it came from storage
    if (allSuggestions.value.get(suggestion)?.isFromStorage) {
        storageSuggestions.value?.delete(suggestion)
        emit('suggestion:removed', suggestion)
    }
}

// styles
const { modifiers } = toRefs(props)
const bemCssClasses = useModifiers(
    'vv-input-text',
    modifiers,
    computed(() => ({
        'valid': valid.value,
        'invalid': invalid.value,
        'loading': loading.value,
        'disabled': props.disabled,
        'required': props.required,
        'readonly': props.readonly,
        'icon-before': !!hasIconBefore.value,
        'icon-after': !!iconAfter.value,
        'floating': props.floating && !isEmpty(props.label),
        'dirty': isDirty.value,
        'focus': isFocused.value && !isDisabledOrReadonly.value,
        'auto-width': props.autoWidth,
    })),
)

// attrs
const isTextLike = computed(() => {
    const textLikeTypes: InputType[] = [
        INPUT_TYPES.TEXT,
        INPUT_TYPES.SEARCH,
        INPUT_TYPES.URL,
        INPUT_TYPES.TEL,
        INPUT_TYPES.EMAIL,
        INPUT_TYPES.PASSWORD,
    ]
    return textLikeTypes.includes(type.value)
})
const isDateTimeLike = computed(() => {
    const dateTimeTypes: InputType[] = [
        INPUT_TYPES.DATE,
        INPUT_TYPES.MONTH,
        INPUT_TYPES.WEEK,
        INPUT_TYPES.TIME,
        INPUT_TYPES.DATETIME_LOCAL,
    ]
    return dateTimeTypes.includes(type.value)
})
const isTextWithConstraints = computed(() => {
    const textConstraintTypes: InputType[] = [
        INPUT_TYPES.TEXT,
        INPUT_TYPES.SEARCH,
        INPUT_TYPES.URL,
        INPUT_TYPES.TEL,
        INPUT_TYPES.EMAIL,
        INPUT_TYPES.PASSWORD,
    ]
    return textConstraintTypes.includes(type.value)
})
const hasAttrs = computed(() => {
    const typeValue = (() => {
        if (isPassword.value && showPassword.value) {
            return INPUT_TYPES.TEXT
        }
        if (isDateTime.value && !isDirty.value && !focused.value) {
            return INPUT_TYPES.TEXT
        }
        if (props.iMask) {
            return INPUT_TYPES.TEXT
        }
        return props.type
    })()
    const toReturn: InputHTMLAttributes = {
        'type': typeValue,
        'name': props.name,
        'tabindex': hasTabindex.value,
        'disabled': props.disabled,
        'readonly': props.readonly,
        'required': props.required,
        'autocomplete': props.autocomplete,
        'aria-invalid': isInvalid.value,
        'aria-describedby': hasHintLabelOrSlot.value
            ? hasHintId.value
            : undefined,
        'aria-errormessage': hasInvalidLabelOrSlot.value
            ? hasHintId.value
            : undefined,
        'inputMode': props.inputMode,
    } as InputHTMLAttributes

    // Date/time/number attributes
    if (isDateTimeLike.value || typeValue === INPUT_TYPES.NUMBER) {
        let max = props.max
        if (typeValue === INPUT_TYPES.DATE && !max) {
            max = '9999-12-31'
        }
        toReturn.step = props.step
        toReturn.max = max !== undefined ? String(max) : undefined
        toReturn.min = props.min !== undefined ? String(props.min) : undefined
    }

    // Text-like types with placeholder
    if (isTextLike.value || typeValue === INPUT_TYPES.NUMBER) {
        toReturn.placeholder = inputTextPlaceholder.value
    }

    // Text-like types with constraints
    if (isTextWithConstraints.value) {
        toReturn.minlength = props.minlength
        toReturn.maxlength = props.maxlength
        toReturn.pattern = props.pattern
    }

    // Email multiple
    if (typeValue === INPUT_TYPES.EMAIL) {
        toReturn.multiple = props.multiple
    }

    return toReturn
})

// slots
const slotProps = computed(() => ({
    valid: props.valid,
    invalid: props.invalid,
    modelValue: props.modelValue,
    togglePassword: onTogglePassword,
    stepUp: onStepUp,
    stepDown: onStepDown,
    clear: onClear,
}))

// components
const {
    HintSlot,
    hasHintLabelOrSlot,
    hasInvalidLabelOrSlot,
    hintSlotScope,
} = HintSlotFactory(propsDefaults, slots)
const PasswordInputActions = VvInputTextActionsFactory(
    INPUT_TYPES.PASSWORD,
    props,
    isDirty,
)
const NumberInputActions = VvInputTextActionsFactory(
    INPUT_TYPES.NUMBER,
    props,
    isDirty,
)
const SearchInputActions = VvInputTextActionsFactory(
    INPUT_TYPES.SEARCH,
    props,
    isDirty,
)

// auto-width
function onClickInner() {
    if (!isDisabledOrReadonly.value) {
        focused.value = true
    }
}
const hasStyle = computed(() => {
    if (!props.autoWidth) {
        return undefined
    }
    return {
        width: localModelValue.value !== undefined
            ? `${String(localModelValue.value).length + 1}ch`
            : undefined,
    }
})

// keydown
function onKeyDown(event: KeyboardEvent) {
    switch (event.code) {
        case 'ArrowUp':
            if (isNumber.value) {
                onStepUp()
                event.preventDefault()
            }
            break

        case 'ArrowDown':
            if (isNumber.value) {
                onStepDown()
                event.preventDefault()
            }
            break
    }
    emit('keydown', event)
}
</script>

<script lang="ts">
export default {
    name: 'VvInputText',
}
</script>

<template>
    <div :class="bemCssClasses">
        <label v-if="label" :for="hasId" class="vv-input-text__label">
            {{ label }}
        </label>
        <div ref="wrapperEl" class="vv-input-text__wrapper">
            <div v-if="$slots.before" class="vv-input-text__input-before">
                <!-- @slot Slot before input icon -->
                <slot name="before" v-bind="slotProps" />
            </div>
            <div
                ref="innerEl"
                class="vv-input-text__inner"
                @click.stop="onClickInner"
            >
                <VvIcon
                    v-if="hasIconBefore"
                    v-bind="hasIconBefore"
                    class="vv-input-text__icon"
                />
                <input
                    :id="hasId"
                    ref="inputEl"
                    v-bind="hasAttrs"
                    :style="hasStyle"
                    @keyup="emit('keyup', $event)"
                    @keydown="onKeyDown"
                    @keypress="emit('keypress', $event)"
                >
                <div
                    v-if="(unit || $slots.unit) && isDirty"
                    class="vv-input-text__unit"
                >
                    <!-- @slot Slot to replace unit -->
                    <slot name="unit" v-bind="slotProps">
                        {{ unit }}
                    </slot>
                </div>
            </div>
            <!-- @slot Slot to replace right icon -->
            <VvIcon
                v-if="iconAfter"
                v-bind="iconAfter"
                class="vv-input-text__icon vv-input-text__icon-after"
            />
            <PasswordInputActions
                v-else-if="isPassword && !hideActions && !isDisabledOrReadonly"
                @toggle-password="onTogglePassword"
            />
            <NumberInputActions
                v-else-if="isNumber && !hideActions && !isDisabledOrReadonly"
                @step-up="onStepUp"
                @step-down="onStepDown"
            />
            <SearchInputActions
                v-else-if="isSearch && !hideActions && !isDisabledOrReadonly"
                @clear="onClear"
            />
            <!-- @slot Slot after input -->
            <div v-if="$slots.after" class="vv-input-text__input-after">
                <!-- @slot Slot before input icon -->
                <slot name="after" v-bind="slotProps" />
            </div>
            <span v-if="count" class="vv-input-text__limit">
                <!-- @slot Slot to replace count -->
                <slot name="count" v-bind="slotProps">
                    {{ countFormatted }}
                </slot>
            </span>
        </div>
        <HintSlot :id="hasHintId" class="vv-input-text__hint">
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
        <VvDropdown
            v-if="hasSuggestions"
            ref="suggestionsDropdownEl"
            :reference="wrapperEl"
            :autofocus-first="false"
            :trigger-width="true"
        >
            <template #items>
                <VvDropdownOption
                    v-for="value in filteredSuggestions"
                    :key="String(value)"
                    @click.stop="onSuggestionSelect(value)"
                >
                    <div class="flex-1">
                        <slot name="suggestion" v-bind="{ value }">
                            {{ value }}
                        </slot>
                    </div>
                    <button
                        v-if="allSuggestions.get(value)?.isFromStorage && hasIconRemoveSuggestion"
                        type="button"
                        tabindex="-1"
                        class="cursor-pointer"
                        :title="labelRemoveSuggestion"
                        @click.stop="onSuggestionRemove(value)"
                    >
                        <VvIcon v-bind="hasIconRemoveSuggestion" />
                    </button>
                </VvDropdownOption>
            </template>
        </VvDropdown>
    </div>
</template>
