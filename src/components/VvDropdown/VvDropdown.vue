<script lang="ts">
export default {
	name: 'VvDropdown'
}
</script>

<script setup lang="ts">
import { toRefs } from 'vue'
import { nanoid } from 'nanoid'
import { useBemModifiers } from '@/composables/useModifiers'
import { contains, equals, removeFromList } from '@/utils/ObjectUtilities'
import { VvDropdownProps, type Option } from '@/components/VvDropdown'

// props, emit
const props = defineProps(VvDropdownProps)
const emit = defineEmits(['update:modelValue'])

// data
const id = nanoid()
const { modifiers, disabled } = toRefs(props)

// styles
const { bemCssClasses: dropdownClasses } = useBemModifiers('vv-dropdown', {
	modifiers,
	disabled
})

/**
 * Check if an option exist into modelValue array (multiple) or is equal to modelValue (single)
 * @param {String | Option} option
 */
function getChecked(option: string | Option) {
	if (Array.isArray(props.modelValue)) {
		// check if contain whole option or option value
		return (
			contains(option, props.modelValue) ||
			contains(getValue(option), props.modelValue)
		)
	}
	// check if modelValue is equal to option or option value
	return (
		equals(option, props.modelValue) ||
		equals(getValue(option), props.modelValue)
	)
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
 * Retrieve the disabled state of an option based on prop "disabled" or the disabled attribute
 * @param {String | Option} option
 */
function getDisabled(option: string | Option): boolean {
	if (typeof option === 'string' || option.disabled === undefined) {
		return disabled.value
	}
	return option.disabled
}

/**
 * Function triggered on input of checkbox or radio (multple or single mode)
 * @param event on input event (checkbox or radio input)
 */
function onInput(event: Event) {
	const target = event.target as HTMLInputElement

	// Value initialized with string input value
	// Can be an Array of string or an Option or Array of Options
	let value: string | string[] | Option | Option[] = target.value
	// Find option object if useObject prop is true and options are objects
	const valueObject = props.useObject
		? props.options?.find(
				(option) => (option as Option)[props.valueKey] == value
		  )
		: null

	// use valueObject if exist or the target value
	value = valueObject || value

	// Check multiple prop, override value with array and remove or add the value
	if (props.multiple) {
		// check maxValues prop and block check new values
		if (
			typeof props.maxValues !== 'undefined' &&
			props.maxValues >= 0 &&
			Array.isArray(props.modelValue) &&
			props.modelValue?.length >= props.maxValues
		) {
			if (
				(Array.isArray(props.modelValue) &&
					!contains(value, props.modelValue)) ||
				props.maxValues == 0
			) {
				target.checked = false
				// maxValues reached
				return
			}
		}
		if (Array.isArray(props.modelValue)) {
			value = contains(value, props.modelValue)
				? removeFromList(value, props.modelValue)
				: [...props.modelValue, value]
		} else {
			value = [value as Option]
		}
	}
	emit('update:modelValue', value)
}
</script>

<template>
	<ul :class="dropdownClasses" role="listbox">
		<li v-if="!options?.length" role="option">
			<label>
				{{ labelNoResult }}
			</label>
		</li>
		<li
			v-for="(option, index) in options"
			:key="index"
			role="option"
			:aria-selected="getChecked(option)">
			<label :for="`dropdown-${index}-${id}`">
				<input
					:id="`dropdown-${index}-${id}`"
					:type="multiple ? 'checkbox' : 'radio'"
					:value="getValue(option)"
					:checked="getChecked(option)"
					:disabled="getDisabled(option)"
					tabindex="-1"
					aria-hidden="true"
					@input="onInput" />
				{{ getLabel(option) }}
			</label>
		</li>
	</ul>
</template>
