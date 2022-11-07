<template>
	<ul :class="dropdownClasses" role="listbox">
		<li v-if="!options?.length">
			<label>
				{{ labelNoResult }}
			</label>
		</li>
		<li v-for="(option, index) in options" :key="index">
			<label :for="`dropdown-${index}-${id}`">
				<input
					:id="`dropdown-${index}-${id}`"
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
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { useBemModifiers } from '../../composables/useModifiers'
import ObjectUtilities from '../../utils/ObjectUtilities'
import { VvDropdownProps, type Option } from './VvDropdown'

const props = defineProps(VvDropdownProps)
const emit = defineEmits(['update:modelValue'])

// data
const id = uuidv4()
const { modifiers, disabled } = toRefs(props)

//Styles & css classes modifiers
const { bemCssClasses: dropdownClasses } = useBemModifiers('vv-dropdown', {
	modifiers,
	disabled
})

/**
 * Check if an option exist into modelValue array (multiple) or is equal to modelValue (single)
 * @param {String | Option} option
 */
function isSelected(option: string | Option) {
	if (Array.isArray(props.modelValue)) {
		// check if contain whole option or option value
		return (
			ObjectUtilities.contains(option, props.modelValue) ||
			ObjectUtilities.contains(getValue(option), props.modelValue)
		)
	}
	// check if modelValue is equal to option or option value
	return (
		ObjectUtilities.equals(option, props.modelValue) ||
		ObjectUtilities.equals(getValue(option), props.modelValue)
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
			props.modelValue?.length >= props.maxValues
		) {
			if (
				(Array.isArray(props.modelValue) &&
					!ObjectUtilities.contains(value, props.modelValue)) ||
				props.maxValues == 0
			) {
				target.checked = false
				// maxValues reached
				return
			}
		}
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
