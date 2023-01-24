<script lang="ts">
	export default {
		name: 'VvComboboxDropdown',
	}
</script>

<script setup lang="ts">
	import { nanoid } from 'nanoid'
	import { useBemModifiers } from '@/composables/useModifiers'
	import { useOptions } from '@/composables/useOptions'
	import { contains, equals, removeFromList } from '@/utils/ObjectUtilities'
	import type { Option } from '@/types/generic'
	import {
		DisabledProps,
		IdNameProps,
		ModifiersProps,
		OptionsProps,
	} from '@/props'

	// props, emit
	const props = defineProps({
		...IdNameProps,
		...OptionsProps,
		...DisabledProps,
		...ModifiersProps,
		/**
		 * modelValue can be a string, number, boolean, object or array of string, number, boolean, object
		 */
		modelValue: {
			type: [String, Number, Boolean, Object, Array],
		},
		/**
		 * Label of "no results" options
		 */
		labelNoResults: { type: String, default: 'No results' },
		/**
		 * Manage modelValue as string[] or object[]
		 */
		multiple: Boolean,
		/**
		 * The max number of selected values
		 */
		maxValues: [Number, String],
		/**
		 * If true the input will be unselectable
		 */
		unselectable: { type: Boolean, default: true },
	})
	const emit = defineEmits(['update:modelValue'])

	// data
	const hasId = computed(() => String(props.id || nanoid()))
	const { modifiers, disabled } = toRefs(props)

	// options
	const { getOptionLabel, getOptionValue, getOptionDisabled } =
		useOptions(props)

	// styles
	const { bemCssClasses: dropdownClasses } = useBemModifiers(
		'vv-dropdown vv-dropdown--place-bottom vv-dropdown--block',
		{
			modifiers,
			disabled,
		},
	)

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
					:disabled="getOptionDisabled(option)"
					:name="name"
					tabindex="-1"
					aria-hidden="true"
				/>
				{{ getOptionLabel(option) }}
			</label>
		</li>
	</ul>
</template>
