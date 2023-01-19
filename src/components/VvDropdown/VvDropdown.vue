<script lang="ts">
	export default {
		name: 'VvDropdown',
	}
</script>

<script setup lang="ts">
	import { computed, toRefs } from 'vue'
	import { nanoid } from 'nanoid'
	import { useBemModifiers } from '@/composables/useModifiers'
	import { useOptions } from '@/composables/useOptions'
	import { contains, equals, removeFromList } from '@/utils/ObjectUtilities'
	import { VvDropdownProps } from '@/components/VvDropdown'
	import type { Option } from '@/types/generic'

	// props, emit
	const props = defineProps(VvDropdownProps)
	const emit = defineEmits(['update:modelValue'])

	// data
	const hasId = computed(() => String(props.id || nanoid()))
	const { modifiers, disabled } = toRefs(props)

	// options
	const { getOptionLabel, getOptionValue } = useOptions(props)

	// styles
	const { bemCssClasses: dropdownClasses } = useBemModifiers('vv-dropdown', {
		modifiers,
		disabled,
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
				contains(getOptionValue(option), props.modelValue)
			)
		}
		// check if modelValue is equal to option or option value
		return (
			equals(option, props.modelValue) ||
			equals(getOptionValue(option), props.modelValue)
		)
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
	function onInput(value: string | Option) {
		if (props.disabled) {
			return
		}

		let toReturn: string | string[] | Option | Option[] | undefined = value
		// Check multiple prop, override value with array and remove or add the value
		if (props.multiple) {
			// check maxValues prop and block check new values
			if (Array.isArray(props.modelValue)) {
				if (
					props.maxValues !== undefined &&
					props.maxValues >= 0 &&
					props.modelValue?.length >= props.maxValues
				) {
					if (!contains(value, props.modelValue)) {
						// maxValues reached
						return
					}
				}
				toReturn = contains(value, props.modelValue)
					? removeFromList(value, props.modelValue)
					: [...props.modelValue, value]
			} else {
				toReturn = [value as Option]
			}
		} else if (props.unselectable && value === props.modelValue) {
			toReturn = undefined
		}
		emit('update:modelValue', toReturn)
	}
</script>

<template>
	<ul :id="hasId" :class="dropdownClasses" role="listbox">
		<li v-if="!options?.length" role="option">
			<label>
				{{ labelNoResults }}
			</label>
		</li>
		<li
			v-for="(option, index) in options"
			:key="index"
			role="option"
			:aria-selected="getChecked(option)"
		>
			<label
				:for="`dropdown-${index}-${hasId}`"
				@click.prevent="onInput(getOptionValue(option))"
			>
				<input
					:id="`dropdown-${index}-${hasId}`"
					:type="multiple ? 'checkbox' : 'radio'"
					:value="getOptionValue(option)"
					:checked="getChecked(option)"
					:disabled="getDisabled(option)"
					:name="name"
					tabindex="-1"
					aria-hidden="true"
				/>
				{{ getOptionLabel(option) }}
			</label>
		</li>
	</ul>
</template>
