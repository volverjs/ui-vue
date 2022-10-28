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
import type { IInputGroupOptions } from '../../composables/group/types'

import { computed, useAttrs, ref } from 'vue'
import ObjectUtilities from '../../utils/ObjectUtilities'
import { InputGroupState } from '../../composables/group/models'
import { VvCheckProps, VvCheckEvents } from './VvCheck'

//Costanti
import { VV_CHECK_GROUP } from '../../constants'

//Composables
import { useGroupOrLocalState } from '../../composables/group/useGroupOrLocalState'
import { useComponentFocus } from '../../composables/focus/useComponentFocus'

//Props, Emits, Slots e Attrs
const props = defineProps(VvCheckProps)
const emit = defineEmits(VvCheckEvents)
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
	} as LabelHTMLAttributes
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
	const { id = '', name = '' } = attrs
	return {
		type: 'checkbox',
		id: id || name,
		name,
		value: props.value,
		disabled: isDisabled.value,
		readonly: isReadonly.value,
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
