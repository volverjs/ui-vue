<template>
	<label :class="checkClass" v-bind="checkAttrs" @click="onClick">
		<input
			ref="input"
			:class="checkInputClass"
			v-bind="checkInputAttrs"
			@input="onChange" />
		<!-- @slot Use this slot for check label -->
		<slot :value="modelValue">
			{{ label }}
		</slot>
	</label>
</template>

<script setup lang="ts">
import type { InputHTMLAttributes, LabelHTMLAttributes } from 'vue'

import { computed, useAttrs, ref } from 'vue'
import ObjectUtilities from '../../utils/ObjectUtilities'
import { VvCheckProps, VvCheckEvents } from './VvCheck'

//Composables
import { toCheckInputRefs } from './useCheckProps'
import { useComponentFocus } from '../../composables/focus/useComponentFocus'
import { useBemModifiers } from '@/composables/useModifiers'

//Props, Emits, Slots e Attrs
const props = defineProps(VvCheckProps)
const emit = defineEmits(VvCheckEvents)
const attrs = useAttrs()

//Data
const { disabled, readonly, valid, error, propsSwitch, modelValue } =
	toCheckInputRefs(props, emit)

//Template References
const input = ref()

// FOCUS
const { focused } = useComponentFocus(input, emit)

//Component computed
const isChecked = computed(() => {
	if (props.binary)
		return ObjectUtilities.equals(modelValue.value, props.trueValue)

	return Array.isArray(modelValue.value)
		? ObjectUtilities.contains(props.value, modelValue.value)
		: ObjectUtilities.equals(props.value, modelValue.value)
})

// Styles & Bindings
const { bemCssClasses: bemCheckClass } = useBemModifiers('vv-input-checkbox', {
	switch: propsSwitch,
	valid,
	invalid: error
})
const { bemCssClasses: bemCheckInputClass } = useBemModifiers(
	'vv-input-check__input',
	{
		checked: isChecked,
		disabled,
		readonly
	}
)
const checkClass = computed(() => {
	const cssClass = attrs.class as string
	return {
		[cssClass]: true,
		...bemCheckClass.value
	}
})
const checkInputClass = computed(() => {
	return {
		...bemCheckInputClass.value,
		'focus-visible': focused.value
	}
})
const checkAttrs = computed(() => {
	const { id, name, style } = attrs
	const dataAttrs = ObjectUtilities.pickBy(attrs, (k: string) =>
		k.startsWith('data-')
	)
	return {
		for: (id || name) as string,
		style,
		...dataAttrs
	} as LabelHTMLAttributes
})
const checkInputAttrs = computed(() => {
	const { id = '', name = '' } = attrs
	return {
		type: 'checkbox',
		id: id || name,
		name,
		value: props.value,
		disabled: disabled.value,
		readonly: readonly.value,
		checked: isChecked.value,
		...checkInputAriaAttrs.value
	} as InputHTMLAttributes
})
const checkInputAriaAttrs = computed(() => {
	const { name } = attrs
	const dataAttrs = ObjectUtilities.pickBy(attrs, (k: string) =>
		k.startsWith('aria-')
	)
	return {
		'aria-label': name,
		'aria-checked': isChecked.value,
		...dataAttrs
	}
})

//Methods
function onChange() {
	if (props.binary) {
		modelValue.value = isChecked.value ? props.falseValue : props.trueValue
		return
	}

	if (modelValue.value === null) {
		modelValue.value = [props.value]
		return
	}

	if (Array.isArray(modelValue.value)) {
		modelValue.value = !isChecked.value
			? [...modelValue.value, props.value]
			: ObjectUtilities.removeFromList(props.value, modelValue.value)
		return
	}

	console.warn('Cannot change value - VvCheck modelValue is not an array')
}
function onClick(event: MouseEvent | undefined) {
	if (!disabled.value) {
		emit('click', event)
		emit('change', isChecked.value ? props.value : null)
		focused.value = true
	}
}
</script>

<script lang="ts">
export default {
	inheritAttrs: false
}
</script>
