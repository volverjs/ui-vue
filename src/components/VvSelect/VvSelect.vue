<script lang="ts">
export default {
	name: 'VvSelect'
}
</script>

<script setup lang="ts">
import { computed, ref, toRefs, useSlots, watch } from 'vue'
import { nanoid } from 'nanoid'
import { onClickOutside, refDebounced, useFocus } from '@vueuse/core'
import type { Option } from '@/components/VvDropdown'
import { isEmpty, filterArray } from '@/utils/ObjectUtilities'
import { useBemModifiers } from '@/composables/useModifiers'
import HintSlotFactory from '@/components/common/HintSlot'
import VvDropdown from '@/components/VvDropdown/VvDropdown.vue'
import VvNativeSelect from '@/components/VvNativeSelect/VvNativeSelect.vue'
import { VvSelectProps } from '@/components/VvSelect'

const props = defineProps(VvSelectProps)
const slots = useSlots()

const emit = defineEmits(['update:modelValue', 'change:search'])

// hint slot
const { HintSlot } = HintSlotFactory(props, slots)

// template ref
const dropdown = ref()
const inputSearch = ref()

// focus state
useFocus(inputSearch, { initialValue: true })

// data
const id = nanoid()
const searchText = ref('')
const debouncedSearchText = refDebounced(
	searchText,
	Number(props.debounceSearch)
)
const dropdownOpen = ref(false)
const {
	modifiers,
	disabled,
	readonly,
	loading,
	iconLeft,
	iconRight,
	valid,
	error
} = toRefs(props)

// emit on change search text
watch(debouncedSearchText, () =>
	emit('change:search', debouncedSearchText.value)
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
	iconLeft,
	iconRight,
	valid,
	invalid: error,
	dirty: isDirty
})

// check if options are objects
const isOptionsObjects = computed(() =>
	props.options?.every((option) => typeof option === 'object')
)

// current options, filtered or prop options
const currentOptions = computed(() =>
	props.searchable ? filteredOptions.value : props.options
)

// options filtered by search text
const filteredOptions = computed(() => {
	return props.options?.filter((option) => {
		if (typeof option === 'string') {
			return option
				.toLowerCase()
				.includes(debouncedSearchText.value.toLowerCase().trim())
		}
		if (typeof option[props.labelKey] === 'string') {
			return (option[props.labelKey] as string)
				.toLowerCase()
				.includes(debouncedSearchText.value.toLowerCase().trim())
		}
		return false
	})
})

/**
 * Compute the label to show to the user
 * Check if is multiple mode, object mode or "string" mode
 */
const labelValue = computed(() => {
	// #region multiple mode
	if (
		props.multiple &&
		Array.isArray(props.modelValue) &&
		props.modelValue?.length
	) {
		if (isOptionsObjects.value) {
			// filter options by selected values
			return filterArray<Option>(
				props.options as Option[],
				props.modelValue,
				props.valueKey
			)
				.map((option) => option[props.labelKey])
				.join(props.separator)
		} else {
			return props.modelValue.join(props.separator)
		}
	}
	// #endregion multiple mode

	// #region single mode
	const selectedOption = props.useObject
		? props.modelValue
		: props.options?.find((option) =>
				typeof option === 'object'
					? option[props.valueKey] == props.modelValue
					: option == props.modelValue
		  )

	return typeof selectedOption === 'object'
		? selectedOption?.[props.labelKey]
		: selectedOption
	// #endregion single mode
})

// methods

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
			<summary
				class="vv-select__input"
				:tabindex="hasTabindex"
				@keyup.space="searchable ? $event.preventDefault() : null">
				<!-- #region search input -->
				<template v-if="searchable && dropdownOpen">
					<input
						:id="`${id}-input`"
						ref="inputSearch"
						v-model="searchText"
						role="combobox"
						:placeholder="searchPlaceholder" />
				</template>
				<!-- #endregion search input -->
				<!-- #region label of selected value/s -->
				<template v-else>
					{{ labelValue || placeholder }}
				</template>
				<!-- #endregion label of selected value/s -->
			</summary>
			<VvDropdown
				:id="`${id}-dropdown`"
				v-bind="{
					...props,
					options: currentOptions
				}"
				@update:model-value="onInput" />
		</details>
		<HintSlot class="vv-select__hint" />
	</div>
	<VvNativeSelect
		v-else
		v-bind="props"
		@update:model-value="emit('update:modelValue', $event)" />
</template>
