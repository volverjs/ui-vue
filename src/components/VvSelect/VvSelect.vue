<script setup lang="ts" generic="T extends string | Option">
import type { SelectHTMLAttributes } from 'vue'
import type { VvSelectEmits } from '.'
import type { Option } from '../../types/generic'
import { useVvSelectProps } from '.'
import HintSlotFactory from '../common/HintSlot'
import VvInputClearAction from '../common/VvInputClearAction'
import VvIcon from '../VvIcon/VvIcon.vue'

// props, emit and slots
// WARNING: This is a provisiaonal implementation, it may change in the future
const props = defineProps(useVvSelectProps<T>())
const emit = defineEmits<VvSelectEmits>()
const slots = useSlots()

// props merged with volver defaults (now only for labels)
const VvSelectProps = useVvSelectProps<T>()
const propsDefaults = useDefaults<typeof VvSelectProps>(
    'VvSelect',
    VvSelectProps,
    props,
)

// template refs
const selectEl = ref<HTMLSelectElement>()

// hint
const {
    HintSlot,
    hasHintLabelOrSlot,
    hasInvalidLabelOrSlot,
    hintSlotScope,
} = HintSlotFactory(propsDefaults, slots)

// focus
const { focused } = useComponentFocus(selectEl, emit)

// group
function isGroup(option: T) {
    if (typeof option === 'string') {
        return false
    }
    return option.options?.length
}

// data
const {
    id,
    modifiers,
    disabled,
    readonly,
    loading,
    icon,
    iconPosition,
    invalid,
    valid,
    floating,
    multiple,
} = toRefs(props)
const hasId = useUniqueId(id)
const hasHintId = computed(() => `${hasId.value}-hint`)

// tabindex
const isDisabledOrReadonly = computed(() => props.disabled || props.readonly)
const hasTabindex = computed(() => {
    return isDisabledOrReadonly.value ? -1 : props.tabindex
})

// modelValue
const localModelValue = computed({
    get: () => {
        return props.modelValue
    },
    set: (newValue) => {
        if (Array.isArray(newValue)) {
            newValue = newValue.filter(item => item !== undefined)
            if (newValue.length === 0 && !props.unselectable && selectEl.value) {
                selectEl.value.value = String(props.modelValue)
                return
            }
        }
        emit('update:modelValue', newValue)
    },
})
const isDirty = computed(() => {
    if (Array.isArray(localModelValue.value)) {
        return localModelValue.value.length > 0
    }
    return localModelValue.value !== undefined && localModelValue.value !== null
})

const isUnselectable = computed(() => {
    if (isDisabledOrReadonly.value) {
        return false
    }
    return props.unselectable
})

// visibility
const isVisible = useElementVisibility(selectEl)
watch(isVisible, (newValue) => {
    if (newValue && props.autofocus) {
        focused.value = true
    }
})
// icons
const { hasIconBefore, hasIconAfter } = useComponentIcon(icon, iconPosition)

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

// styles
const bemCssClasses = useModifiers(
    'vv-select',
    modifiers,
    computed(() => ({
        'valid': valid.value,
        'invalid': invalid.value,
        'loading': loading.value,
        'disabled': disabled.value,
        'readonly': readonly.value,
        'icon-before': hasIconBefore.value !== undefined,
        'icon-after': hasIconAfter.value !== undefined,
        'dirty': isDirty.value,
        'focus': focused.value && !isDisabledOrReadonly.value,
        'floating': floating.value,
        'multiple': multiple.value,
    })),
)

// options
const {
    getOptionLabel,
    getOptionValue,
    isOptionDisabled,
    getOptionGrouped,
} = useOptions(props)

/**
 * Auto select the first option if autoOpen is enabled
 */
watch(
    () => props.options,
    (newValue) => {
        if (newValue?.length && props.autoselectFirst && !isDirty.value) {
            const firstOptionValue = getOptionValue(newValue[0])
            localModelValue.value = props.multiple ? [firstOptionValue] : firstOptionValue
        }
    },
    { immediate: true },
)

/**
 * Function triggered on clear button click
 */
function onClear() {
    if (Array.isArray(localModelValue.value)) {
        localModelValue.value = []
    } else {
        localModelValue.value = undefined
    }
    emit('clear')
}

// attrs
const hasAttrs: SelectHTMLAttributes = computed(() => {
    return {
        'name': props.name,
        'tabindex': hasTabindex.value,
        'disabled': isDisabledOrReadonly.value,
        'required': props.required,
        'size': props.size,
        'autocomplete': props.autocomplete,
        'multiple': props.multiple,
        'aria-invalid': isInvalid.value,
        'aria-describedby': hasHintLabelOrSlot.value
            ? hasHintId.value
            : undefined,
        'aria-errormessage': hasInvalidLabelOrSlot.value
            ? hasHintId.value
            : undefined,
    }
})

// slots
const slotProps = computed(() => ({
    valid: props.valid,
    invalid: props.invalid,
    modelValue: props.modelValue,
}))
</script>

<script lang="ts">
export default {
    name: 'VvSelect',
}
</script>

<template>
    <div :class="bemCssClasses">
        <label v-if="label" :for="hasId">{{ label }}</label>
        <!-- #region native select -->
        <div class="vv-select__wrapper">
            <div v-if="$slots.before" class="vv-select__input-before">
                <!-- @slot Slot before input -->
                <slot name="before" v-bind="slotProps" />
            </div>
            <div class="vv-select__inner">
                <VvIcon v-if="hasIconBefore" v-bind="hasIconBefore" class="vv-select__icon" />
                <select :id="hasId" ref="selectEl" v-bind="hasAttrs" v-model="localModelValue">
                    <option v-if="placeholder" :value="undefined" :disabled="!isUnselectable" :hidden="!isUnselectable">
                        {{ placeholder }}
                    </option>
                    <template v-for="(option, index) in options">
                        <option
                            v-if="!isGroup(option)" :key="index" :disabled="isOptionDisabled(option)"
                            :value="getOptionValue(option)"
                        >
                            {{ getOptionLabel(option) }}
                        </option>
                        <optgroup
                            v-else :key="`group-${index}`" :disabled="isOptionDisabled(option)"
                            :label="getOptionLabel(option)"
                        >
                            <option
                                v-for="(item, i) in getOptionGrouped(option)" :key="`group-${index}-item-${i}`"
                                :disabled="isOptionDisabled(item)" :value="getOptionValue(item)"
                            >
                                {{ getOptionLabel(item) }}
                            </option>
                        </optgroup>
                    </template>
                </select>
                <VvInputClearAction
                    v-if="isUnselectable" input-type="select" :label="labelClear" :icon="iconClear"
                    @clear="onClear"
                />
                <VvIcon v-if="hasIconAfter" v-bind="hasIconAfter" class="vv-select__icon vv-select__icon-after" />
            </div>
            <div v-if="$slots.after" class="vv-select__input-after">
                <!-- @slot Slot after input -->
                <slot name="after" v-bind="slotProps" />
            </div>
        </div>
        <!-- #endregion native select -->
        <HintSlot :id="hasHintId" class="vv-select__hint">
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
