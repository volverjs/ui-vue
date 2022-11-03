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

import { computed, useAttrs, ref, toRefs } from 'vue'
import ObjectUtilities from '../../utils/ObjectUtilities'
import { InputGroupState } from '../../composables/group/models'
import { VvCheckProps, VvCheckEvents } from './VvCheck'

//Costanti
import { VV_CHECK_GROUP } from '../../constants'

//Composables
import { useGroupOrLocalState } from '../../composables/group/useGroupOrLocalState'
import { useComponentFocus } from '../../composables/focus/useComponentFocus'
import { useBemModifiers } from '@/composables/useModifiers'

//Props, Emits, Slots e Attrs
const props = defineProps(VvCheckProps)
const emit = defineEmits(VvCheckEvents)
const attrs = useAttrs()

//Data
const {
	disabled,
	readonly,
	valid,
	error,
	switch: propsSwitch,
	modelValue: propsModelValue
} = toRefs(props)

//Template References
const input = ref()

// #region group
const groupState = new InputGroupState(VV_CHECK_GROUP, {
	modelValue: propsModelValue,
	disabled,
	readonly
})
const { modelValue, isDisabled, isReadonly, checkIsSelected } =
	useGroupOrLocalState(VV_CHECK_GROUP, groupState)
// #endregion group

// FOCUS
const { focused } = useComponentFocus(input, emit)

//Component computed
const isChecked = computed(() => {
	return props.binary
		? ObjectUtilities.equals(modelValue.value, props.trueValue)
		: checkIsSelected(props.value)
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
		disabled: isDisabled,
		readonly: isReadonly
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
