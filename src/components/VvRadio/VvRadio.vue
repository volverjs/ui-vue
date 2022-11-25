<script lang="ts">
export default {
	name: 'VvRadio',
	inheritAttrs: false
}
</script>

<script setup lang="ts">
import type { InputHTMLAttributes, LabelHTMLAttributes } from 'vue'

import { computed, useAttrs, ref } from 'vue'
import { contains, equals, pickBy } from '../../utils/ObjectUtilities'
import { VvRadioProps, VvRadioEvents } from './VvRadio'

//Composables
import { toRadioInputRefs } from './useRadioProps'
import { useComponentFocus } from '../../composables/focus/useComponentFocus'
import { useBemModifiers } from '@/composables/useModifiers'

//Props, Emits, Slots e Attrs
const props = defineProps(VvRadioProps)
const emit = defineEmits(VvRadioEvents)
const attrs = useAttrs()

//Data
const { disabled, readonly, modelValue, valid, error } = toRadioInputRefs(
	props,
	emit
)

//Template References
const input = ref()

//Component computed
const isChecked = computed(() => {
	return Array.isArray(modelValue.value)
		? contains(props.value, modelValue.value)
		: equals(props.value, modelValue.value)
})

// #region FOCUS
const { focused } = useComponentFocus(input, emit)
// #endregion FOCUS

//Styles & Bindings
const { bemCssClasses: bemRadioClass } = useBemModifiers('vv-input-radio', {
	valid,
	invalid: error
})
const { bemCssClasses: bemInputRadioClass } = useBemModifiers(
	'vv-input-radio__input',
	{
		checked: isChecked,
		disabled,
		readonly
	}
)
const radioClass = computed(() => {
	const { class: cssClass } = attrs
	return {
		class: cssClass,
		...bemRadioClass.value
	}
})
const radioInputClass = computed(() => {
	return {
		'focus-visible': focused.value,
		...bemInputRadioClass.value
	}
})
const radioAttrs = computed(() => {
	const { id, name, style } = attrs
	const dataAttrs = pickBy(attrs, (k: string) => k.startsWith('data-'))
	return {
		for: (id || name) as string,
		style,
		...dataAttrs
	} as LabelHTMLAttributes
})
const radioInputAttrs = computed(() => {
	const { id = '', name = '' } = attrs as InputHTMLAttributes
	return {
		type: 'radio',
		id: id || name,
		name,
		value: props.value,
		disabled: disabled.value,
		readonly: readonly.value,
		checked: isChecked.value,
		...radioInputAriaAttrs.value
	} as InputHTMLAttributes
})
const radioInputAriaAttrs = computed(() => {
	const { name } = attrs
	const dataAttrs = pickBy(attrs, (k: string) => k.startsWith('aria-'))
	return {
		'aria-label': name,
		'aria-checked': isChecked.value,
		...dataAttrs
	}
})

//Methods
function onChange() {
	if (!isChecked.value) emit('change', props.value)
	modelValue.value = props.value
}
function onClick(event: Event) {
	if (!disabled.value) {
		emit('click', event)
		focused.value = true
	}
}
</script>

<template>
	<label :class="radioClass" v-bind="radioAttrs" @click="onClick">
		<input
			ref="input"
			:class="radioInputClass"
			v-bind="radioInputAttrs"
			@input="onChange" />
		<slot :value="modelValue">
			{{ label }}
		</slot>
	</label>
</template>
