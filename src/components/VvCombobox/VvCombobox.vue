<script setup lang="ts" generic="T extends string | Option">
import type { Ref } from 'vue'
import { toRefs } from 'vue'
import type { Option } from '../../types/generic'
import { DropdownRole } from '../../constants'
import HintSlotFactory from '../common/HintSlot'
import VvBadge from '../VvBadge/VvBadge.vue'
import VvButton from '../VvButton/VvButton.vue'
import VvDropdown from '../VvDropdown/VvDropdown.vue'
import VvDropdownOptgroup from '../VvDropdown/VvDropdownOptgroup.vue'
import VvDropdownOption from '../VvDropdown/VvDropdownOption.vue'
import VvIcon from '../VvIcon/VvIcon.vue'
import VvSelect from '../VvSelect/VvSelect.vue'
import { type VvComboboxEvents, useVvComboboxProps } from '.'

// props, emit and slots
// WARNING: This is a provisiaonal implementation, it may change in the future
const props = defineProps(useVvComboboxProps<T>())
const emit = defineEmits<VvComboboxEvents>()
const slots = useSlots()

// props merged with volver defaults (now only for labels)
const VvComboboxProps = useVvComboboxProps<T>()
const propsDefaults = useDefaults<typeof VvComboboxProps>(
    'VvCombobox',
    VvComboboxProps,
    props,
)

// template ref
const inputEl: Ref<HTMLElement | null> = ref(null)
const inputSearchEl: Ref<HTMLElement | null> = ref(null)
const wrapperEl: Ref<HTMLElement | null> = ref(null)
const dropdownEl = ref<typeof VvDropdown>()

// hint slot
const {
    HintSlot,
    hasHintLabelOrSlot,
    hasInvalidLabelOrSlot,
    hintSlotScope,
} = HintSlotFactory(propsDefaults, slots)

// focus
const { focused } = useComponentFocus(inputEl, emit)
const { focused: focusedWithin } = useFocusWithin(wrapperEl)

watch(focused, (newValue) => {
    if (!props.autoOpen) {
        return
    }
    if (newValue && !expanded.value) {
        expand()
        return
    }
    if (!newValue && expanded.value && !focusedWithin.value) {
        collapse()
    }
})

watch(focusedWithin, (newValue) => {
    if (!focused.value && !newValue && expanded.value) {
        collapse()
    }
})

// search
const searchText = ref('')
const debouncedSearchText = refDebounced(
    searchText,
    computed(() => Number(props.debounceSearch)),
)
watch(debouncedSearchText, () => {
    emit('update:search', debouncedSearchText.value)
    // DEPRECATED: Must be removed in the future
    // eslint-disable-next-line vue/custom-event-name-casing
    emit('change:search', debouncedSearchText.value)
})

// expanded
const expanded = ref(false)
function toggleExpanded() {
    if (isDisabledOrReadonly.value)
        return
    expanded.value = !expanded.value
}
function expand() {
    if (isDisabledOrReadonly.value || expanded.value)
        return
    expanded.value = true
}
function collapse() {
    if (isDisabledOrReadonly.value || !expanded.value)
        return
    expanded.value = false
}
function onAfterExpand() {
    if (propsDefaults.value.searchable) {
        if (inputSearchEl.value) {
            inputSearchEl.value.focus({
                preventScroll: true,
            })
        }
    }
}
function onAfterCollapse() {
    if (propsDefaults.value.searchable) {
        searchText.value = ''
    }
}

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
    icon,
    iconPosition,
    modifiers,
    disabled,
    required,
    readonly,
    loading,
    valid,
    invalid,
    floating,
} = toRefs(props)
const hasId = useUniqueId(id)
const hasHintId = computed(() => `${hasId.value}-hint`)
const hasDropdownId = computed(() => `${hasId.value}-dropdown`)
const hasSearchId = computed(() => `${hasId.value}-search`)
const hasLabelId = computed(() => `${hasId.value}-label`)

// tabindex
const isDisabledOrReadonly = computed(() => props.disabled || props.readonly)
const hasTabindex = computed(() => {
    return isDisabledOrReadonly.value ? -1 : props.tabindex
})

// modelValue
const localModelValue = computed({
    get: () => {
        if (Array.isArray(props.modelValue)) {
            return props.modelValue
        }
        return props.modelValue !== undefined && props.modelValue !== null ? [props.modelValue] : []
    },
    set: (value: unknown[]) => {
        emit('update:modelValue', props.multiple || Array.isArray(props.modelValue) ? value : value.pop())
    },
})
const sizeOfModelValue = computed(() => localModelValue.value.length)
const isDirty = computed(() => sizeOfModelValue.value > 0)
const hasMaxValues = computed(() => {
    if (!props.multiple) {
        return 1
    }
    if (props.maxValues === undefined) {
        return Infinity
    }
    return Number(props.maxValues)
})
const isUnselectable = computed(() => {
    if (isDisabledOrReadonly.value) {
        return false
    }
    // DEPRECATED: Must be removed in the future
    if (!props.unselectable) {
        return false
    }
    return Number(props.minValues) === 0 || (sizeOfModelValue.value > Number(props.minValues))
})
const isSelectable = computed(() => {
    if (isDisabledOrReadonly.value) {
        return false
    }
    if (!props.multiple) {
        return true
    }
    return sizeOfModelValue.value < hasMaxValues.value
})

// loading
const localLoading = ref(false)
const isLoading = computed(() => localLoading.value || loading.value)

// icons
const { hasIconBefore, hasIconAfter } = useComponentIcon(icon, iconPosition)

// styles
const bemCssClasses = useModifiers(
    'vv-select',
    modifiers,
    computed(() => ({
        'disabled': disabled.value,
        'required': required.value,
        'loading': isLoading.value,
        'readonly': readonly.value,
        'icon-before': hasIconBefore.value !== undefined,
        'icon-after': hasIconAfter.value !== undefined,
        'valid': valid.value,
        'invalid': invalid.value,
        'dirty': isDirty.value,
        'focus': focused.value || focusedWithin.value || expanded.value,
        'floating': floating.value,
        'badges': props.badges,
    })),
)

// options
const {
    getOptionLabel,
    getOptionValue,
    getOptionGrouped,
    isOptionDisabled,
} = useOptions(props)

function isOptionDisabledOrNotSelectable(option: T) {
    return isOptionDisabled(option) || (!isSelectable.value && !isOptionSelected(option))
}

const filteredOptions = computedAsync(async () => {
    if (propsDefaults.value.searchFunction) {
        localLoading.value = true
        const toReturn = await Promise.resolve(
            propsDefaults.value.searchFunction(
                debouncedSearchText.value,
                props.options,
            ),
        )
        localLoading.value = false
        return toReturn
    }
    return props.options?.filter((option) => {
        return getOptionLabel(option)
            .toLowerCase()
            .includes(debouncedSearchText.value.toLowerCase().trim())
    })
})

/**
 * Check if an option is selected
 * @param {T} option
 */
function isOptionSelected(option: T) {
    const optionValue = getOptionValue(option)
    if (typeof optionValue === 'object') {
        return localModelValue.value.some((item) => {
            if (typeof item === 'object') {
                return JSON.stringify(item) === JSON.stringify(optionValue)
            }
            return false
        })
    }
    return localModelValue.value.includes(optionValue)
}

/**
 * Compute the label to show to the user
 * Check if is multiple mode, object mode or "string" mode
 */
const selectedOptions = computed(() => {
    const options = props.options.reduce<T[]>(
        (acc, value) => {
            if (isGroup(value)) {
                return [...acc, ...getOptionGrouped(value)]
            }
            return [...acc, value]
        },
        [],
    )
    return options.filter((option) => {
        return isOptionSelected(option)
    })
})

const hasValue = computed(() => {
    return selectedOptions.value
        .map((option: T) => getOptionLabel(option))
        .join(props.separator)
})

/**
 * Function triggered on click on input
 */
function onClickInput() {
    props.autoOpen ? expand() : toggleExpanded()
}

/**
 * Function triggered on option click
 * @param option {T} option value
 */
function onInput(option: T) {
    const isSelected = isOptionSelected(option)
    const optionValue = getOptionValue(option)
    if (isSelected && isUnselectable.value) {
        localModelValue.value = localModelValue.value.filter((item) => {
            if (typeof optionValue === 'object' && typeof item === 'object') {
                return JSON.stringify(item) !== JSON.stringify(optionValue)
            }
            return item !== optionValue
        })
    }
    else if (!isSelected && isSelectable.value) {
        if (!props.multiple) {
            localModelValue.value = []
        }
        localModelValue.value = [...localModelValue.value, optionValue]
    }
    if (!props.multiple && !props.keepOpen) {
        collapse()
    }
}

/**
 * Auto select the first option if autoOpen is enabled
 */
watch(
    () => props.options,
    (newValue) => {
        if (newValue?.length && props.autoselectFirst && !isDirty.value) {
            onInput(newValue[0])
        }
    },
    { immediate: true },
)

const selectProps = computed(() => ({
    id: hasId.value,
    name: props.name,
    tabindex: hasTabindex.value,
    valid: valid.value,
    validLabel: propsDefaults.value.validLabel,
    invalid: invalid.value,
    invalidLabel: propsDefaults.value.invalidLabel,
    hintLabel: propsDefaults.value.hintLabel,
    loading: isLoading.value,
    loadingLabel: propsDefaults.value.loadingLabel,
    disabled: disabled.value,
    readonly: readonly.value,
    modifiers: propsDefaults.value.modifiers,
    options: propsDefaults.value.options,
    labelKey: propsDefaults.value.labelKey,
    valueKey: propsDefaults.value.valueKey,
    icon: propsDefaults.value.icon,
    iconPosition: propsDefaults.value.iconPosition,
    floating: propsDefaults.value.floating,
    unselectable: isUnselectable.value,
    autoselectFirst: propsDefaults.value.autoselectFirst,
    multiple: propsDefaults.value.multiple,
    label: propsDefaults.value.label,
    placeholder: propsDefaults.value.placeholder,
    modelValue: props.modelValue,
}))

const dropdownProps = computed(() => ({
    id: hasDropdownId.value,
    reference: wrapperEl.value,
    placement: propsDefaults.value.placement,
    strategy: propsDefaults.value.strategy,
    transitionName: propsDefaults.value.transitionName,
    offset: propsDefaults.value.offset,
    shift: propsDefaults.value.shift,
    flip: propsDefaults.value.flip,
    autoPlacement: propsDefaults.value.autoPlacement,
    arrow: propsDefaults.value.arrow,
    autofocusFirst: propsDefaults.value.searchable
        ? true
        : propsDefaults.value.autofocusFirst,
    triggerWidth: propsDefaults.value.triggerWidth,
    modifiers: propsDefaults.value.dropdownModifiers,
}))

// slots
const slotProps = computed(() => ({
    valid: props.valid,
    invalid: props.invalid,
    modelValue: props.modelValue,
}))

// keyboard
onKeyStroke(
    [' ', 'Enter'],
    (e) => {
        if (props.autoOpen) {
            return
        }
        if (!expanded.value && focused.value) {
            e.preventDefault()
            e.stopImmediatePropagation()
            toggleExpanded()
        }
    },
    { target: inputEl },
)
</script>

<script lang="ts">
export default {
    name: 'VvCombobox',
    components: {
        VvDropdown,
        VvDropdownOption,
        VvDropdownOptgroup,
        VvButton,
    },
}
</script>

<template>
    <div v-if="!native" :id="hasId" :class="bemCssClasses">
        <label
            v-if="label"
            :id="hasLabelId"
            :for="propsDefaults.searchable ? hasSearchId : undefined"
        >
            {{ label }}
        </label>
        <div ref="wrapperEl" class="vv-select__wrapper">
            <VvDropdown
                ref="dropdownEl"
                v-model="expanded"
                v-bind="dropdownProps"
                :role="DropdownRole.listbox"
                @after-expand="onAfterExpand"
                @after-collapse="onAfterCollapse"
            >
                <template
                    v-if="
                        propsDefaults.searchable || $slots['dropdown::before']
                    "
                    #before
                >
                    <!-- @slot Slot before dropdown items -->
                    <slot name="dropdown::before" />
                    <input
                        v-if="propsDefaults.searchable && !disabled"
                        :id="hasSearchId"
                        ref="inputSearchEl"
                        v-model="searchText"
                        aria-autocomplete="list"
                        :aria-controls="hasDropdownId"
                        autocomplete="off"
                        spellcheck="false"
                        type="search"
                        class="vv-dropdown__search"
                        :placeholder="propsDefaults.searchPlaceholder"
                    >
                </template>
                <template #default="{ aria }">
                    <div v-if="$slots.before" class="vv-select__input-before">
                        <!-- @slot Slot before input -->
                        <slot name="before" v-bind="slotProps" />
                    </div>
                    <div class="vv-select__inner">
                        <VvIcon
                            v-if="hasIconBefore"
                            v-bind="hasIconBefore"
                            class="vv-select__icon"
                        />
                        <div
                            ref="inputEl"
                            v-bind="aria"
                            class="vv-select__input"
                            role="combobox"
                            :aria-controls="hasDropdownId"
                            :aria-expanded="expanded"
                            :aria-labelledby="hasLabelId"
                            :aria-describedby="
                                hasHintLabelOrSlot ? hasHintId : undefined
                            "
                            :aria-errormessage="
                                hasInvalidLabelOrSlot ? hasHintId : undefined
                            "
                            :tabindex="hasTabindex"
                            @click.passive="onClickInput"
                        >
                            <!-- @slot Slot for value customization -->
                            <slot
                                name="value"
                                v-bind="{ selectedOptions, onInput }"
                            >
                                <template v-if="hasValue">
                                    <div
                                        v-if="!badges"
                                        class="vv-select__value"
                                    >
                                        {{ hasValue }}
                                    </div>
                                    <VvBadge
                                        v-for="(
                                            option, index
                                        ) in selectedOptions"
                                        v-else
                                        :key="index"
                                        :modifiers="badgeModifiers"
                                        class="vv-select__badge"
                                    >
                                        {{ getOptionLabel(option) }}
                                        <button
                                            v-if="
                                                isUnselectable
                                            "
                                            :aria-label="
                                                propsDefaults.deselectActionLabel
                                            "
                                            type="button"
                                            @click.stop="onInput(option)"
                                        >
                                            <VvIcon name="close" />
                                        </button>
                                    </VvBadge>
                                </template>
                                <template v-else>
                                    {{ placeholder }}
                                </template>
                            </slot>
                        </div>
                        <VvIcon
                            v-if="hasIconAfter"
                            v-bind="hasIconAfter"
                            class="vv-select__icon vv-select__icon-after"
                        />
                    </div>
                    <div v-if="$slots.after" class="vv-select__input-after">
                        <!-- @slot Slot after input -->
                        <slot name="after" v-bind="slotProps" />
                    </div>
                </template>
                <template #items>
                    <template v-if="!disabled && filteredOptions?.length">
                        <template
                            v-for="(option, index) in filteredOptions"
                            :key="index"
                        >
                            <template v-if="isGroup(option)">
                                <VvDropdownOptgroup
                                    :label="getOptionLabel(option)"
                                />
                                <VvDropdownOption
                                    v-for="(item, i) in getOptionGrouped(
                                        option,
                                    )"
                                    v-bind="{
                                        selected: isOptionSelected(item),
                                        disabled: isOptionDisabledOrNotSelectable(item),
                                        unselectable: isUnselectable,
                                        deselectHintLabel:
                                            propsDefaults.deselectHintLabel,
                                        selectHintLabel:
                                            propsDefaults.selectHintLabel,
                                        selectedHintLabel:
                                            propsDefaults.selectedHintLabel,
                                    }"
                                    :key="i"
                                    class="vv-dropdown-option"
                                    focus-on-hover
                                    @click.passive="onInput(item)"
                                >
                                    <!-- @slot Slot for option customization -->
                                    <slot
                                        name="option"
                                        v-bind="{
                                            option,
                                            selectedOptions,
                                            selected: isOptionSelected(item),
                                            disabled: isOptionDisabledOrNotSelectable(item),
                                        }"
                                    >
                                        {{ getOptionLabel(item) }}
                                    </slot>
                                </VvDropdownOption>
                            </template>
                            <VvDropdownOption
                                v-else
                                v-bind="{
                                    selected: isOptionSelected(option),
                                    disabled: isOptionDisabledOrNotSelectable(option),
                                    unselectable: isUnselectable,
                                    deselectHintLabel:
                                        propsDefaults.deselectHintLabel,
                                    selectHintLabel:
                                        propsDefaults.selectHintLabel,
                                    selectedHintLabel:
                                        propsDefaults.selectedHintLabel,
                                }"
                                class="vv-dropdown-option"
                                focus-on-hover
                                @click.passive="onInput(option)"
                            >
                                <!-- @slot Slot for option customization -->
                                <slot
                                    name="option"
                                    v-bind="{
                                        option,
                                        selectedOptions,
                                        selected: isOptionSelected(option),
                                        disabled: isOptionDisabledOrNotSelectable(option),
                                    }"
                                >
                                    {{ getOptionLabel(option) }}
                                </slot>
                            </VvDropdownOption>
                        </template>
                    </template>
                    <VvDropdownOption
                        v-else-if="!options.length"
                        modifiers="inert"
                    >
                        <!-- @slot Slot for no options available -->
                        <slot name="no-options">
                            {{ propsDefaults.noOptionsLabel }}
                        </slot>
                    </VvDropdownOption>
                    <VvDropdownOption v-else-if="!disabled" modifiers="inert">
                        <!-- @slot Slot for no results available -->
                        <slot name="no-results">
                            {{ propsDefaults.noResultsLabel }}
                        </slot>
                    </VvDropdownOption>
                </template>
                <template #after>
                    <!-- @slot Slot after dropdown items -->
                    <slot name="dropdown::after">
                        <!-- Close button if dropdown custom position is enabled and floating-ui disabled -->
                        <VvButton
                            v-if="dropdownEl?.customPosition"
                            :label="propsDefaults.closeLabel"
                            modifiers="secondary"
                            @click="dropdownEl.hide()"
                        />
                    </slot>
                </template>
            </VvDropdown>
        </div>
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
    <VvSelect
        v-else
        v-bind="selectProps"
        @update:model-value="emit('update:modelValue', $event)"
    />
</template>
