<script lang="ts">
export default {
	name: 'VvCombobox'
}
</script>

<script setup lang="ts">
import { computed, ref, toRefs, useSlots, watch } from 'vue'
import { nanoid } from 'nanoid'
import { onClickOutside, refDebounced } from '@vueuse/core'
import { isEmpty } from '@/utils/ObjectUtilities'
import { useBemModifiers } from '@/composables/useModifiers'
import { useComponentIcon } from '@/composables/useComponentIcons'
import { useOptions } from '@/composables/useOptions'
import { useComponentFocus } from '@/composables/useComponentFocus'
import VvDropdown from '@/components/VvDropdown/VvDropdown.vue'
import VvIcon from '@/components/VvIcon/VvIcon.vue'
import HintSlotFactory from '@/components/common/HintSlot'
import { VvComboboxProps, VvComboboxEvents } from '@/components/VvCombobox'

// props, emit and slots
const props = defineProps(VvComboboxProps)
const emit = defineEmits(VvComboboxEvents)
const slots = useSlots()

// hint slot
const { HintSlot } = HintSlotFactory(props, slots)

// template ref
const dropdown = ref()
const inputSearch = ref()

// focus
const { focused } = useComponentFocus(dropdown, emit)

// data
const id = nanoid()
const searchText = ref('')
const debouncedSearchText = refDebounced(
	searchText,
	Number(props.debounceSearch)
)
const dropdownOpen = ref(false)
const {
	icon,
	iconPosition,
	modifiers,
	disabled,
	readonly,
	loading,
	valid,
	invalid
} = toRefs(props)

// emit on change search text
watch(debouncedSearchText, () =>
	emit('change:search', debouncedSearchText.value)
)

// icons
const { hasIcon, hasIconLeft, hasIconRight } = useComponentIcon(
	icon,
	iconPosition
)

// dirty
const isDirty = computed(() => !isEmpty(props.modelValue))

// tabindex
const hasTabindex = computed(() => {
	return disabled.value || readonly.value ? -1 : props.tabindex
})

// styles
const { bemCssClasses } = useBemModifiers('vv-select', {
	modifiers,
	disabled,
	loading,
	readonly,
	iconLeft: hasIconLeft,
	iconRight: hasIconRight,
	valid,
	invalid,
	dirty: isDirty,
	focus: focused
})

// current options, filtered or prop options
const hasOptions = computed(() =>
	props.searchable ? filteredOptions.value : props.options
)

const { getOptionLabel, getOptionValue } = useOptions(props)

// options filtered by search text
const filteredOptions = computed(() => {
	return props.options?.filter((option) => {
		return getOptionLabel(option)
			.toLowerCase()
			.includes(debouncedSearchText.value.toLowerCase().trim())
	})
})

/**
 * Compute the label to show to the user
 * Check if is multiple mode, object mode or "string" mode
 */
const selectedOptions = computed(() => {
	let selectedValues: Array<typeof props.modelValue> = []
	if (Array.isArray(props.modelValue)) {
		selectedValues = props.modelValue
	} else if (props.modelValue) {
		selectedValues = [props.modelValue]
	}
	return props.options.filter((option) =>
		selectedValues.includes(getOptionValue(option))
	)
})

const hasLabel = computed(() => {
	return selectedOptions.value
		.map((option) => getOptionValue(option))
		.join(props.separator)
})

// close dropdown on click outside
onClickOutside(dropdown, () => {
	dropdown.value.open = false
})

// Function triggered on toggle dropdown (open/close)
function onToggle(event: Event) {
	const target = event.target as HTMLDetailsElement
	dropdownOpen.value = target.open
}

/**
 * Function triggered on input of checkbox or radio (multple or single mode)
 * @param event on input event (checkbox or radio input)
 */
function onInput(value: typeof props.modelValue) {
	// close dropdown in single mode
	if (dropdown.value && !props.multiple) {
		dropdown.value.open = false
	}
	emit('update:modelValue', value)
}

const dropdownProps = computed(() => ({
	options: hasOptions.value,
	labelKey: props.labelKey,
	valueKey: props.valueKey,
	disabled: props.disabled,
	labelNoResults: props.labelNoResults,
	multiple: props.multiple,
	maxValues: props.maxValues,
	modelValue: props.modelValue
}))
</script>

<template>
	<div v-if="!native" :id="id" :class="bemCssClasses">
		<label
			v-if="label"
			:id="`${id}-label`"
			:for="searchable && dropdownOpen ? `${id}-input` : undefined"
			>{{ label }}</label
		>
		<details
			ref="dropdown"
			class="vv-select__wrapper"
			@click="disabled || readonly ? $event.preventDefault() : null"
			@keyup.esc="dropdown.open = false"
			@toggle="onToggle">
			<!-- @slot Slot to replace left icon -->
			<summary
				class="vv-select__input"
				:tabindex="hasTabindex"
				@keyup.space="searchable ? $event.preventDefault() : null">
				<slot name="before">
					<VvIcon
						v-if="hasIconLeft"
						class="vv-select__icon-left"
						v-bind="hasIcon" />
				</slot>
				<!-- #region search input -->
				<template v-if="searchable && dropdownOpen">
					<input
						:id="`${id}-input`"
						ref="inputSearch"
						v-model="searchText"
						role="combobox"
						type="search"
						:placeholder="searchPlaceholder" />
				</template>
				<!-- #endregion search input -->
				<!-- #region label of selected value/s -->
				<template v-else>
					{{ hasLabel || placeholder }}
				</template>
				<!-- #endregion label of selected value/s -->
				<slot name="after">
					<VvIcon
						v-if="hasIconRight"
						class="vv-select__icon-right"
						v-bind="hasIcon" />
				</slot>
			</summary>
			<!-- @slot Slot to replace right icon -->
			<VvDropdown
				:id="`${id}-dropdown`"
				v-bind="dropdownProps"
				@update:model-value="onInput" />
		</details>
		<HintSlot class="vv-select__hint" />
	</div>
	<!-- <VvSelect
		v-else
		v-bind="props"
		@update:model-value="emit('update:modelValue', $event)" /> -->
</template>
