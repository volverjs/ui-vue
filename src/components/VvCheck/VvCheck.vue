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
import type { InputHTMLAttributes } from 'vue'
import type { IInputGroupOptions } from '../../composables/group/types'

import { computed, useAttrs, ref } from 'vue'
import ObjectUtilities from '../../utils/ObjectUtilities'
import { InputGroupState } from '../../composables/group/models'

//Costanti
import { VV_CHECK_GROUP } from '../../constants'

//Composables
import { useGroupOrLocalState } from '../../composables/group/useGroupOrLocalState'
import { useComponentFocus } from '../../composables/focus/useComponentFocus'

//Props, Emits, Slots e Attrs
const props = defineProps({
	/**
	 * Valore della check
	 */
	value: null,
	/**
	 * VModel
	 * @description
	 * Se Binary = true, modelValue puo essere Object,Boolean,Number
	 * Altrimenti modelValue sarà un Array
	 */
	modelValue: null,
	/**
	 * True - ritorna un valore del checkbox binario (es True/False) invece di un valori multipli
	 */
	binary: Boolean,
	/**
	 * Se binary=true, valore associato allo stato checked (ritornato al posto di TRUE)
	 */
	trueValue: { type: null, default: true },
	/**
	 * Se binary=true, valore associato allo stato unchecked (ritornato al posto di FALSE)
	 */
	falseValue: { type: null, default: false },
	/**
	 * True - visualizza il VvCheck come un pulsante Switch/Toggle
	 */
	switch: Boolean,
	valid: Boolean,
	validLabel: [String, Array],
	error: Boolean,
	/**
	 * Messaggi di errore.
	 */
	errors: [String, Array],
	label: String,
	disabled: Boolean,
	readonly: Boolean
})
const emit = defineEmits([
	'click',
	'update:modelValue',
	'change',
	'focus',
	'blur'
])
const attrs = useAttrs()

//Template References
const input = ref()

//Component computed
const isChecked = computed(() => {
	return props.binary
		? ObjectUtilities.equals(modelValue.value, props.trueValue)
		: checkIsSelected(props.value)
})

// #region group
// Define input options
const inputGroupOptions: IInputGroupOptions = {
	disabled: props.disabled,
	modelValue: props.modelValue,
	readonly: props.readonly
}
// Create groupState instance
const groupState = new InputGroupState(VV_CHECK_GROUP, inputGroupOptions)
// Use group composable to inject the provided group
const { modelValue, isDisabled, isReadonly, checkIsSelected } =
	useGroupOrLocalState(VV_CHECK_GROUP, groupState)
// #endregion group

// FOCUS
const { focused } = useComponentFocus(input, emit)

// Styles & Bindings
const checkClass = computed(() => {
	const { class: cssClass } = attrs
	return {
		'vv-input-checkbox': true,
		'vv-input-checkbox--switch': props.switch,
		'vv-input-checkbox--valid': props.valid,
		'vv-input-checkbox--invalid': props.error,
		class: cssClass
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
	}
})
const checkInputClass = computed(() => {
	return {
		'focus-visible': focused.value,
		'vv-input-check__input--checked': isChecked.value,
		'vv-input-check__input--disabled': isDisabled.value,
		'vv-input-check__input--readonly': isReadonly.value
	}
})
const checkInputAttrs = computed(() => {
	const { id = '', name = '' } = attrs as InputHTMLAttributes
	return {
		type: 'checkbox',
		id: id || name,
		name,
		value: props.value,
		disabled: isDisabled.value,
		readonly: isReadonly.value,
		checked: isChecked.value,
		...checkInputAriaAttrs.value
	}
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
		emit('update:modelValue', modelValue.value)
		return
	}

	if (modelValue.value === null) {
		modelValue.value = [props.value]
		emit('update:modelValue', modelValue.value)
		return
	}

	if (Array.isArray(modelValue.value)) {
		modelValue.value = !isChecked.value
			? [...modelValue.value, props.value]
			: ObjectUtilities.removeFromList(props.value, modelValue.value)
		emit('update:modelValue', modelValue.value)
		return
	}

	console.warn('Cannot change value - VvCheck modelValue is not an array')
}
function onClick(event: MouseEvent | undefined) {
	if (!isDisabled) {
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

<style lang="scss">
@import '@volverjs/style/components/vv-input-checkbox';
</style>
