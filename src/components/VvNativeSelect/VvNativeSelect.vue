<script lang="ts">
export default {
	name: 'VvNativeSelect'
}
</script>

<script setup lang="ts">
import { computed, toRefs, useSlots } from 'vue'
import { nanoid } from 'nanoid'
import { isEmpty } from '@/utils/ObjectUtilities'
import VvIcon from '@/components/VvIcon/VvIcon.vue'
import HintSlotFactory from '@/components/common/HintSlot'
import { useBemModifiers } from '@/composables/useModifiers'
import {
	type Option,
	VvNativeSelectProps,
	VvNativeSelectEmits
} from '@/components/VvNativeSelect'

// props, emit and slots
const props = defineProps(VvNativeSelectProps)
const emit = defineEmits(VvNativeSelectEmits)
const slots = useSlots()

// hint
const HintSlot = HintSlotFactory(props, slots)

// data
const {
	modifiers,
	disabled,
	readonly,
	loading,
	iconLeft,
	iconRight,
	error,
	valid
} = toRefs(props)

const id = nanoid()

// styles
const { bemCssClasses } = useBemModifiers('vv-select', {
	modifiers,
	loading,
	readonly,
	iconLeft,
	iconRight,
	valid,
	invalid: error,
	dirty: computed(() => !isEmpty(props.modelValue))
})

/**
 * Retrieve the option value based on prop "valueKey" or the option if it is a string
 * @param {String | Option} option
 */
function getValue(option: string | Option) {
	return typeof option === 'string' ? option : option[props.valueKey]
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
 * Function triggered on select (multple or single mode)
 * @param event on select event (checkbox or radio input)
 */
function onInput(event: Event) {
	const target = event.target as HTMLSelectElement

	// Find option object if useObject prop is true
	const valueObject = props.useObject
		? props.options?.find(
				(option) => (option as Option)[props.valueKey] == target.value
		  )
		: null

	// use valueObject if exist or the target value
	const value = valueObject || target.value

	emit('update:modelValue', value)
}
</script>

<template>
	<div :class="bemCssClasses">
		<label v-if="label" :for="id">{{ label }}</label>
		<!-- #region native select -->
		<div class="vv-select__wrapper">
			<slot name="icon-left">
				<vv-icon v-if="iconLeft" :name="iconLeft" />
			</slot>
			<select
				:id="id"
				:value="
					typeof modelValue === 'string'
						? modelValue
						: modelValue?.[valueKey]
				"
				:disabled="disabled || readonly"
				@input="onInput">
				<option v-if="placeholder" value="" disabled selected>
					{{ placeholder }}
				</option>
				<option
					v-for="(option, index) in options"
					:key="index"
					:disabled="getDisabled(option)"
					:value="getValue(option)">
					{{ getLabel(option) }}
				</option>
			</select>
			<slot name="icon-right">
				<vv-icon v-if="iconRight" :name="iconRight" />
			</slot>
		</div>
		<!-- #endregion native select -->
		<HintSlot class="vv-select__hint" />
	</div>
</template>
