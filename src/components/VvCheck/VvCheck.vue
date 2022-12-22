<script lang="ts">
export default {
	name: 'VvCheck'
}
</script>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { contains, equals, removeFromList } from '@/utils/ObjectUtilities'
import { useBemModifiers } from '@/composables/useModifiers'
import {
	VvCheckProps,
	VvCheckEvents,
	useGroupProps
} from '@/components/VvCheck'

// props, emits, slots and attrs
const props = defineProps(VvCheckProps)
const emit = defineEmits(VvCheckEvents)

// data
const { disabled, readonly, valid, error, propsSwitch, modelValue } =
	useGroupProps(props, emit)

// template ref
const input = ref()

// computed
const localModelValue = computed({
	get() {
		if (props.binary) {
			return modelValue.value as boolean
		}
		return Array.isArray(modelValue.value)
			? contains(props.value, modelValue.value)
			: equals(props.value, modelValue.value)
	},
	set(newValue) {
		if (props.binary) {
			modelValue.value = newValue
			return
		}
		if (Array.isArray(modelValue.value)) {
			modelValue.value = !isChecked.value
				? [...modelValue.value, props.value]
				: removeFromList(props.value, modelValue.value)
			return
		}
		modelValue.value = modelValue.value === null ? props.value : null
		emit('change', newValue)
	}
})

const isChecked = computed(() => {
	if (props.binary) {
		return props.trueValue !== undefined
			? modelValue.value === props.trueValue
			: modelValue.value !== null
	}
	return Array.isArray(modelValue.value)
		? contains(props.value, modelValue.value)
		: equals(props.value, modelValue.value)
})

// styles
const { bemCssClasses: bemlabelClasses } = useBemModifiers(
	'vv-input-checkbox',
	{
		switch: propsSwitch,
		valid,
		invalid: error
	}
)
const { bemCssClasses: bemInputClasses } = useBemModifiers(
	'vv-input-check__input',
	{
		checked: isChecked,
		disabled,
		readonly
	}
)

const value = computed(() => {
	return typeof props.value === 'string' ? props.value : undefined
})

watchEffect(() => {
	if (props.binary && Array.isArray(modelValue.value)) {
		// eslint-disable-next-line no-console
		console.warn(
			`[VvCheck] The model value is an array but the component is in binary mode.`
		)
	}
})
</script>

<template>
	<label :class="bemlabelClasses">
		<input
			ref="input"
			v-model="localModelValue"
			type="checkbox"
			:true-value="trueValue"
			:false-value="falseValue"
			:class="bemInputClasses"
			:disabled="disabled"
			:value="value" />
		<!-- @slot Use this slot for check label -->
		<slot :value="modelValue">
			{{ label }}
		</slot>
	</label>
</template>
