<template>
	<div :class="hasClass">
		<label v-if="props.label" for="select">{{ props.label }}</label>
		<!-- #region custom dropdown select -->
		<details
			v-if="props.multiple"
			ref="dropdown"
			role="list"
			class="vv-select__wrapper">
			<summary class="vv-select__input" aria-haspopup="listbox">
				{{ modelValue }}
			</summary>
			<ul class="vv-dropdown" role="listbox">
				<li v-for="(option, index) in props.options" :key="index">
					<label :for="`select-${index}`">
						<input
							:id="`select-${index}`"
							type="radio"
							:value="option.value"
							:checked="
								modelValue?.includes(String(option.value))
							"
							@click="onClick(String(option.value))"
							@input="onInput" />
						{{ option.label }}
					</label>
				</li>
			</ul>
		</details>
		<!-- #endregion custom dropdown select -->

		<!-- #region native select -->
		<div v-else class="vv-select__wrapper">
			<slot name="icon-left">
				<vv-icon v-if="props.iconLeft" :name="props.iconLeft" />
			</slot>
			<select
				id="select"
				aria-describedby="select-hint"
				:value="props.modelValue"
				:disabled="props.disabled || props.readonly"
				@input="onInput">
				<option value="" disabled selected>
					{{ props.placeholder }}
				</option>
				<option
					v-for="(option, index) in props.options"
					:key="index"
					:value="option.value">
					{{ option.label }}
				</option>
			</select>
			<slot name="icon-right">
				<vv-icon v-if="props.iconRight" :name="props.iconRight" />
			</slot>
		</div>
		<!-- #endregion native select -->
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ObjectUtilities from '../../utils/ObjectUtilities'
import VvIcon from '../../components/VvIcon/VvIcon.vue'
import { VvSelectProps } from './VvSelect'

const props = defineProps(VvSelectProps)
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

function onClick(value: string) {
	if (
		Array.isArray(props.modelValue) &&
		props.modelValue?.includes?.(value)
	) {
		emit(
			'update:modelValue',
			ObjectUtilities.removeFromList(value, props.modelValue)
		)
	}
}

function onInput(event: Event) {
	if (dropdown.value && !props.multiple) {
		// close details dropdown on option select
		dropdown.value.open = false
	}
	const target = event.target as HTMLSelectElement
	let value: string | string[] = target.value
	if (props.multiple) {
		if (Array.isArray(props.modelValue)) {
			value = [...props.modelValue, value]
		} else {
			value = [value]
		}
	}
	emit('update:modelValue', value)
}
</script>
