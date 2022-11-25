<script lang="ts">
export default {
	name: 'VvNativeSelect'
}
</script>

<script setup lang="ts">
import { computed, toRefs, useSlots } from 'vue'
import { nanoid } from 'nanoid'
import { isEmpty } from '../../utils/ObjectUtilities'
import { VvNativeSelectProps, type Option } from './VvNativeSelect'
import VvIcon from '../VvIcon/VvIcon.vue'
import HintSlotFactory from '../common/HintSlot'
import { useBemModifiers } from '../../composables/useModifiers'

const props = defineProps(VvNativeSelectProps)
const slots = useSlots()
const emit = defineEmits(['update:modelValue'])
//Hint component
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

//Styles & css classes modifiers
const { bemCssClasses: selectClasses } = useBemModifiers('vv-select', {
	modifiers,
	loading,
	readonly,
	iconLeft,
	iconRight,
	valid,
	invalid: error,
	dirty: computed(() => !isEmpty(props.modelValue))
})

function getValue(option: string | Option) {
	return typeof option === 'string' ? option : option[props.valueKey]
}

function getLabel(option: string | Option) {
	return typeof option === 'string' ? option : option[props.labelKey]
}

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
	<div :class="selectClasses">
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
					:disabled="
						typeof option === 'object'
							? option.disabled ?? disabled
							: disabled
					"
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
