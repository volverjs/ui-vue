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

<script setup lang="ts">
import type { InputHTMLAttributes } from 'vue'
import { computed, useAttrs, useSlots, ref } from 'vue'
import { VV_RADIO_GROUP } from '../../constants'
import { useComponentFocus } from '../../composables/focus/useComponentFocus'
import { useGroupOrLocalState } from '../../composables/group/useGroupOrLocalState'
import ObjectUtilities from '../../utils/ObjectUtilities'
import { InputGroupState } from '../../composables/group/models'
import type { IInputGroupOptions } from '../../composables/group/types'

const attrs = useAttrs()
const slots = useSlots()
const emit = defineEmits([
	'click',
	'update:modelValue',
	'change',
	'focus',
	'blur'
])
const props = defineProps({
	/**
	 * Valore del radio
	 */
	value: null,
	modelValue: { type: [Object, Number, Boolean, String] },
	label: { type: String, default: '' },
	disabled: Boolean,
	readonly: Boolean,
	valid: Boolean,
	validLabel: [String, Array],
	error: Boolean,
	errors: [String, Array]
})

// #region group
// Define reactive props
const inputGroupOptions: IInputGroupOptions = {
	disabled: props.disabled,
	modelValue: props.modelValue,
	readonly: props.readonly
}
// Create groupState instance
const groupState = new InputGroupState(VV_RADIO_GROUP, inputGroupOptions)
// Use group composable to inject the provided group
const { modelValue, isDisabled, isReadonly, checkIsSelected } =
	useGroupOrLocalState(VV_RADIO_GROUP, groupState)
// #endregion group

const input = ref()
const { focused } = useComponentFocus(input, emit)

//Computed
const isChecked = computed(() => {
	return checkIsSelected(props.value)
})
const radioClass = computed(() => {
	const { class: cssClass } = attrs
	return {
		'vv-input-radio': true,
		'vv-input-radio--valid': props.valid,
		'vv-input-radio--invalid': props.error,
		class: cssClass
	}
})
const radioAttrs = computed(() => {
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
const radioInputClass = computed(() => {
	return {
		'focus-visible': focused.value,
		'vv-input-radio__input--checked': isChecked.value,
		'vv-input-radio__input--disabled': isDisabled.value,
		'vv-input-radio__input--readonly': isReadonly.value
	}
})
const radioInputAttrs = computed(() => {
	const { id = '', name = '' } = attrs as InputHTMLAttributes
	return {
		type: 'radio',
		id: id || name,
		name,
		value: props.value,
		disabled: isDisabled.value,
		readonly: isReadonly.value,
		checked: isChecked.value,
		...radioInputAriaAttrs.value
	}
})
const radioInputAriaAttrs = computed(() => {
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
	if (!isChecked.value) emit('change', props.value)
	modelValue.value = props.value
	emit('update:modelValue', modelValue.value)
}
function onClick(event: Event) {
	if (!isDisabled.value) {
		emit('click', event)
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
@import '@volverjs/style/components/vv-input-radio';
</style>
