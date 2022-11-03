<template>
	<div :class="dropdownClasses">
		<label v-if="label" for="select">{{ label }}</label>
		<details
			ref="dropdown"
			role="list"
			class="vv-select__wrapper"
			@click="disabled || readonly ? $event.preventDefault() : null"
			@keyup.esc="dropdown.open = false"
			@toggle="onToggle">
			<summary
				class="vv-select__input"
				aria-haspopup="listbox"
				@keyup.space="searchable ? $event.preventDefault() : null">
				<!-- #region search input -->
				<template v-if="searchable && dropdownOpen">
					<input
						ref="inputSearch"
						v-model="searchText"
						:placeholder="searchPlaceholder" />
				</template>
				<!-- #endregion search input -->
				<!-- #region label of selected value/s -->
				<template v-else>
					{{ labelValue || placeholder }}
				</template>
				<!-- #endregion label of selected value/s -->
			</summary>
			<ul class="vv-dropdown" role="listbox">
				<li v-if="searchable && !currentOptions?.length">
					<label>
						{{ labelNoResult }}
					</label>
				</li>
				<li v-for="(option, index) in currentOptions" :key="index">
					<label :for="`select-${index}`">
						<input
							:id="`select-${index}`"
							:type="multiple ? 'checkbox' : 'radio'"
							:value="getValue(option)"
							:checked="isSelected(option)"
							:disabled="
								typeof option === 'object'
									? option.disabled ?? disabled
									: disabled
							"
							@input="onInput" />
						{{ getLabel(option) }}
					</label>
				</li>
			</ul>
		</details>
		<HintSlot class="vv-select__hint" />
	</div>
</template>

<script setup lang="ts">
import { computed, ref, toRefs, useSlots, watch } from 'vue'
import { onClickOutside, refDebounced, useFocus } from '@vueuse/core'
import ObjectUtilities from '../../utils/ObjectUtilities'
import { VvDropdownProps, type Option } from './VvDropdown'
import HintSlotFactory from '../common/HintSlot'
import { useBemModifiers } from '../../composables/useModifiers'

const props = defineProps(VvDropdownProps)
const slots = useSlots()
const emit = defineEmits(['update:modelValue', 'change:search'])

//Hint component
const HintSlot = HintSlotFactory(props, slots)

// html ref
const dropdown = ref()
const inputSearch = ref()
// autofocus input search
useFocus(inputSearch, { initialValue: true })

// data
const searchText = ref('')
const debouncedSearchText = refDebounced(searchText, props.debounceSearch)
const dropdownOpen = ref(false)
const { modifiers, disabled, readonly, loading, iconLeft, iconRight } =
	toRefs(props)

// watch
// emit on change search text
watch(debouncedSearchText, () =>
	emit('change:search', debouncedSearchText.value)
)

//Styles & css classes modifiers
const { bemCssClasses: dropdownClasses } = useBemModifiers('vv-select', {
	modifiers,
	disabled,
	loading,
	readonly,
	iconLeft,
	iconRight,
	valid: computed(() => props.valid || props.validLabel),
	invalid: computed(
		() => props.error || ObjectUtilities.isNotEmpty(props.errorLabel)
	),
	dirty: computed(() => ObjectUtilities.isNotEmpty(props.modelValue))
})

// computed

// Check if options are objects
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
		return option[props.labelKey]
			.toLowerCase()
			.includes(debouncedSearchText.value.toLowerCase().trim())
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
		props.modelValue?.length &&
		Array.isArray(props.modelValue)
	) {
		if (isOptionsObjects.value) {
			// filter options by selected values
			return ObjectUtilities.filterArray<Option>(
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
 * Retrieve the option value based on prop "valueKey" or the option if it is a string
 * @param {String | Option} option
 */
function getValue(option: string | Option) {
	return typeof option === 'string' ? option : String(option[props.valueKey])
}

/**
 * Retrieve the option label based on prop "labelKey" or the option if it is a string
 * @param {String | Option} option
 */
function getLabel(option: string | Option) {
	return typeof option === 'string' ? option : option[props.labelKey]
}

/**
 * Check if an option exist into modelValue array (multiple) or is equal to modelValue (single)
 * @param {String | Option} option
 */
function isSelected(option: string | Option) {
	let optionValue: Option | string = typeof option === 'string' ? option : ''
	if (!optionValue) {
		optionValue = props.useObject ? option : getValue(option)
	}
	return props.multiple && Array.isArray(props.modelValue)
		? ObjectUtilities.contains(optionValue, props.modelValue)
		: ObjectUtilities.equals(optionValue, props.modelValue)
}

/**
 * Function triggered on input of checkbox or radio (multple or single mode)
 * @param event on input event (checkbox or radio input)
 */
function onInput(event: Event) {
	// close dropdown in single mode
	if (dropdown.value && !props.multiple) {
		dropdown.value.open = false
	}
	const target = event.target as HTMLInputElement

	// Value initialized with string input value
	// Can be an Array of string or an Option or Array of Options
	let value: string | string[] | Option | Option[] = target.value
	// Find option object if useObject prop is true and options are objects
	const valueObject =
		props.useObject && isOptionsObjects.value
			? props.options?.find(
					(option) => (option as Option)[props.valueKey] == value
			  )
			: null

	// use valueObject if exist or the target value
	value = valueObject || value

	// Check multiple prop, override value with array and remove or add the value
	if (props.multiple) {
		if (Array.isArray(props.modelValue)) {
			value = ObjectUtilities.contains(value, props.modelValue)
				? ObjectUtilities.removeFromList(value, props.modelValue)
				: [...props.modelValue, value]
		} else {
			value = [value]
		}
	}
	emit('update:modelValue', value)
}
</script>
