<script lang="ts">
export default {
	name: 'VvCheck',
	inheritAttrs: false
}
</script>

<script setup lang="ts">
import {
	type InputHTMLAttributes,
	type LabelHTMLAttributes,
	computed,
	useAttrs,
	ref
} from 'vue'
import {
	contains,
	equals,
	pickBy,
	removeFromList
} from '@/utils/ObjectUtilities'
import { useComponentFocus } from '@/composables/focus/useComponentFocus'
import { useBemModifiers } from '@/composables/useModifiers'
import {
	VvCheckProps,
	VvCheckEvents,
	useGroupProps
} from '@/components/VvCheck'

// props, emits, slots and attrs
const props = defineProps(VvCheckProps)
const emit = defineEmits(VvCheckEvents)
const attrs = useAttrs()

// data
const { disabled, readonly, valid, error, propsSwitch, modelValue } =
	useGroupProps(props, emit)

// template ref
const input = ref()

// status
const { focused } = useComponentFocus(input, emit)

// computed
const isChecked = computed(() => {
	if (props.binary) return equals(modelValue.value, props.trueValue)

	return Array.isArray(modelValue.value)
		? contains(props.value, modelValue.value)
		: equals(props.value, modelValue.value)
})

// styles
const { bemCssClasses: bemCheckClasses } = useBemModifiers(
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
const checkClasses = computed(() => {
	const cssClass = attrs.class as string
	return {
		[cssClass]: true,
		...bemCheckClasses.value
	}
})
const inputClasses = computed(() => {
	return {
		...bemInputClasses.value,
		'focus-visible': focused.value
	}
})
const checkAttrs = computed(() => {
	const { id, name, style } = attrs
	const dataAttrs = pickBy(attrs, (k: string) => k.startsWith('data-'))
	return {
		for: (id || name) as string,
		style,
		...dataAttrs
	} as LabelHTMLAttributes
})
const inputAriaAttrs = computed(() => {
	const { name } = attrs
	const dataAttrs = pickBy(attrs, (k: string) => k.startsWith('aria-'))
	return {
		'aria-label': name,
		'aria-checked': isChecked.value,
		...dataAttrs
	}
})
const inputAttrs = computed(() => {
	const { id = '', name = '' } = attrs
	return {
		type: 'checkbox',
		id: id || name,
		name,
		value: props.value,
		disabled: disabled.value,
		readonly: readonly.value,
		checked: isChecked.value,
		...inputAriaAttrs.value
	} as InputHTMLAttributes
})

// methods
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
			: removeFromList(props.value, modelValue.value)
		return
	}
}
function onClick(event: MouseEvent | undefined) {
	if (!disabled.value) {
		emit('click', event)
		emit('change', isChecked.value ? props.value : null)
		focused.value = true
	}
}
</script>

<template>
	<label :class="checkClasses" v-bind="checkAttrs" @click="onClick">
		<input
			ref="input"
			:class="inputClasses"
			v-bind="inputAttrs"
			@input="onChange" />
		<!-- @slot Use this slot for check label -->
		<slot :value="modelValue">
			{{ label }}
		</slot>
	</label>
</template>
