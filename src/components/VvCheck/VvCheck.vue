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
import { toRefs, type InputHTMLAttributes } from 'vue'
import { computed, useAttrs, useSlots, defineProps, defineEmits } from 'vue'
import { VV_CHECK_GROUP } from '../../constants'
import { useGroupOrLocalState } from '../../composables/group/useGroupOrLocalState'
import { useValidationState } from '../../composables/validation/useValidationState'
import { useInputFocus } from '../../composables/focus/useInputFocus'
import ObjectUtilities from '../../utils/ObjectUtilities'
import type { GroupParentState } from '../../composables/group/group'

const attrs = useAttrs()
const slots = useSlots()

//Props
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

//Emits
const emit = defineEmits([
	'click',
	'update:modelValue',
	'change',
	'focus',
	'blur'
])

//data
let { modelValue, isDisabled, isReadonly, checkIsSelected } =
	useGroupOrLocalState(VV_CHECK_GROUP, toRefs(props) as GroupParentState)
let { input, focused } = useInputFocus({ emit })
const { isValid, isInvalid } = useValidationState(props, { slots })

//Computed
const isChecked = computed(() => {
	return props.binary
		? ObjectUtilities.equals(modelValue.value, props.trueValue)
		: checkIsSelected(props.value)
})
const checkClass = computed(() => {
	const { class: cssClass } = attrs
	return {
		'vv-input-checkbox': true,
		'vv-input-checkbox--switch': props.switch,
		'vv-input-checkbox--valid': isValid.value,
		'vv-input-checkbox--invalid': isInvalid.value,
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
		emit('change', isChecked ? props.value : null)
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
