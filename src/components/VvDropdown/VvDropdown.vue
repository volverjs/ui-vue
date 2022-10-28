<template>
	<div :class="hasClass">
		<label v-if="props.label" for="select">{{ props.label }}</label>
		<details ref="dropdown" role="list" class="vv-select__wrapper">
			<summary class="vv-select__input" aria-haspopup="listbox">
				{{ labelValue || props.placeholder }}
			</summary>
			<ul class="vv-dropdown" role="listbox">
				<li v-for="(option, index) in props.options" :key="index">
					<label :for="`select-${index}`">
						<input
							:id="`select-${index}`"
							:type="props.multiple ? 'checkbox' : 'radio'"
							:value="getValue(option)"
							:checked="isSelected(option)"
							@input="onInput" />
						{{ getLabel(option) }}
					</label>
				</li>
			</ul>
		</details>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ObjectUtilities from '../../utils/ObjectUtilities'
import { VvDropdownProps, type Option } from './VvDropdown'

const props = defineProps(VvDropdownProps)
const emit = defineEmits(['update:modelValue'])

// html ref
const dropdown = ref()

const hasClass = computed(() => [
	'vv-select',
	{
		'vv-select--dirty': ObjectUtilities.isNotEmpty(props.modelValue),
		'vv-select--readonly': props.readonly,
		'vv-select--valid': props.valid || props.validLabel,
		'vv-select--invalid':
			props.error || ObjectUtilities.isNotEmpty(props.errors),
		'vv-select--icon-left': props.iconLeft,
		'vv-select--icon-right': props.iconRight
	}
])

// Check if options are objects
const isOptionsObjects = computed(() => typeof props.options?.[0] === 'object')

const labelValue = computed(() => {
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
})

function getValue(option: string | Option) {
	return typeof option === 'string' ? option : option[props.valueKey]
}

function getLabel(option: string | Option) {
	return typeof option === 'string' ? option : option[props.labelKey]
}

function isSelected(option: Option | string) {
	return props.multiple && Array.isArray(props.modelValue)
		? ObjectUtilities.contains(option, props.modelValue)
		: ObjectUtilities.equals(option, props.modelValue)
}

function onInput(event: Event) {
	if (dropdown.value && !props.multiple) {
		// close details dropdown on option select
		dropdown.value.open = false
	}
	const target = event.target as HTMLInputElement

	// Value initialized with string input value
	// Then can be an Array of string or an Option or Array of Options
	let value: string | string[] | Option | Option[] = target.value
	const valueObject =
		props.useObject && isOptionsObjects.value
			? props.options?.find(
					(option) => (option as Option)[props.valueKey] == value
			  )
			: null
	value = props.useObject && valueObject ? valueObject : value
	if (props.multiple) {
		if (Array.isArray(props.modelValue)) {
			// remove or add value
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
