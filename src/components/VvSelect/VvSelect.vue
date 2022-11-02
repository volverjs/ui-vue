<template>
	<div :class="selectClasses">
		<label v-if="label" for="select">{{ label }}</label>
		<!-- #region native select -->
		<div class="vv-select__wrapper">
			<slot name="icon-left">
				<vv-icon v-if="iconLeft" :name="iconLeft" />
			</slot>
			<select
				id="select"
				:value="modelValue"
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

<script setup lang="ts">
import { computed, toRefs, useSlots } from 'vue'
import ObjectUtilities from '../../utils/ObjectUtilities'
import { VvSelectProps, type Option } from './VvSelect'
import VvIcon from '../../components/VvIcon/VvIcon.vue'
import HintSlotFactory from '../common/HintSlot'
import { useBemModifiers } from '../../composables/useModifiers'

const props = defineProps(VvSelectProps)
const slots = useSlots()
const emit = defineEmits(['update:modelValue'])
//Hint component
const HintSlot = HintSlotFactory(props, slots)

const { modifiers, disabled, readonly, loading, iconLeft, iconRight } =
	toRefs(props)

//Styles & css classes modifiers
const { bemCssClasses: selectClasses } = useBemModifiers('vv-select', {
	modifiers,
	loading,
	readonly,
	iconLeft,
	iconRight,
	valid: computed(() => props.valid || props.validLabel),
	invalid: computed(
		() => props.error || ObjectUtilities.isNotEmpty(props.errors)
	),
	dirty: computed(() => ObjectUtilities.isNotEmpty(props.modelValue))
})

function getValue(option: string | Option) {
	return typeof option === 'string' ? option : option[props.valueKey]
}

function getLabel(option: string | Option) {
	return typeof option === 'string' ? option : option[props.labelKey]
}

function onInput(event: Event) {
	const target = event.target as HTMLSelectElement
	emit('update:modelValue', target.value)
}
</script>
