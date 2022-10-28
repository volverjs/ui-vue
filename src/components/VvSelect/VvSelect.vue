<template>
	<div :class="hasClass">
		<label v-if="props.label" for="select">{{ props.label }}</label>
		<!-- #region native select -->
		<div class="vv-select__wrapper">
			<slot name="icon-left">
				<vv-icon v-if="props.iconLeft" :name="props.iconLeft" />
			</slot>
			<select
				id="select"
				:value="props.modelValue"
				:disabled="props.disabled || props.readonly"
				@input="onInput">
				<option v-if="props.placeholder" value="" disabled selected>
					{{ props.placeholder }}
				</option>
				<option
					v-for="(option, index) in props.options"
					:key="index"
					:value="getValue(option)">
					{{ getLabel(option) }}
				</option>
			</select>
			<slot name="icon-right">
				<vv-icon v-if="props.iconRight" :name="props.iconRight" />
			</slot>
		</div>
		<!-- #endregion native select -->
		<HintSlot class="vv-select__hint" />
	</div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import ObjectUtilities from '../../utils/ObjectUtilities'
import { VvSelectProps, type Option } from './VvSelect'
import VvIcon from '../../components/VvIcon/VvIcon.vue'
import HintSlotFactory from '../common/HintSlot'

const props = defineProps(VvSelectProps)
const slots = useSlots()
const emit = defineEmits(['update:modelValue'])
//Hint component
const HintSlot = HintSlotFactory(props, slots)

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
