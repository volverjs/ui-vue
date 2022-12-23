<script lang="ts">
export default {
	name: 'VvCheckbox'
}
</script>

<script setup lang="ts">
import { computed, ref, useSlots, watchEffect } from 'vue'
import { contains, equals, removeFromList } from '@/utils/ObjectUtilities'
import { useBemModifiers } from '@/composables/useModifiers'
import {
	VvCheckboxProps,
	VvCheckboxEvents,
	useGroupProps
} from '@/components/VvCheckbox'
import { HintSlotFactory } from '@/components/common/HintSlot'

// props, emits and slots
const props = defineProps(VvCheckboxProps)
const emit = defineEmits(VvCheckboxEvents)
const slots = useSlots()

// data
const { disabled, readonly, valid, error, propsSwitch, modelValue } =
	useGroupProps(props, emit)

// template ref
const input = ref()

// computed
const isBinary = computed(() => {
	return props.trueValue !== undefined && props.falseValue !== undefined
})
const isChecked = computed(() => {
	if (isBinary.value) {
		return modelValue.value === props.trueValue
	}
	return Array.isArray(modelValue.value)
		? contains(props.value, modelValue.value)
		: equals(props.value, modelValue.value)
})
const hasValue = computed(() => {
	if (isBinary.value) {
		return undefined
	}
	return ['string', 'number', 'boolean'].includes(typeof props.value)
		? props.value
		: true
})
const localModelValue = computed({
	get() {
		return isChecked.value
	},
	set(newValue) {
		if (isBinary.value) {
			modelValue.value = newValue ? props.trueValue : props.falseValue
			return
		}
		if (Array.isArray(modelValue.value)) {
			modelValue.value = newValue
				? [...modelValue.value, props.value]
				: removeFromList(props.value, modelValue.value)
			return
		}
		modelValue.value = newValue ? props.value : null
		emit('change', newValue)
	}
})

// styles
const { bemCssClasses: bemlabelClasses } = useBemModifiers('vv-checkbox', {
	switch: propsSwitch,
	valid,
	invalid: error,
	disabled,
	readonly
})
const { bemCssClasses: bemInputClasses } = useBemModifiers(
	'vv-input-check__input',
	{
		checked: isChecked
	}
)

watchEffect(() => {
	if (isBinary.value && Array.isArray(modelValue.value)) {
		// eslint-disable-next-line no-console
		console.warn(
			`[VvCheckbox] The model value is an array but the component is in binary mode.`
		)
	}
})

// hint
const HintSlot = HintSlotFactory(props, slots)
</script>

<template>
	<label :class="bemlabelClasses" :for="id">
		<input
			:id="id"
			ref="input"
			v-model="localModelValue"
			type="checkbox"
			:name="name"
			:class="bemInputClasses"
			:disabled="disabled || readonly"
			:value="hasValue" />
		<!-- @slot Use this slot for check label -->
		<slot :value="modelValue">
			{{ label }}
		</slot>
		<HintSlot
			class="vv-input-checkbox__hint"
			:params="{ value: modelValue }" />
	</label>
</template>
