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
import type { InputHTMLAttributes, LabelHTMLAttributes } from 'vue'

import { computed, useAttrs, ref, toRefs } from 'vue'
import ObjectUtilities from '../../utils/ObjectUtilities'
import { InputGroupState } from '../../composables/group/models'
import { VvRadioProps, VvRadioEvents } from './VvRadio'

//Costanti
import { VV_RADIO_GROUP } from '../../constants'

//Composables
import { useComponentFocus } from '../../composables/focus/useComponentFocus'
import { useGroupOrLocalState } from '../../composables/group/useGroupOrLocalState'
import { useBemModifiers } from '@/composables/useModifiers'

//Props, Emits, Slots e Attrs
const props = defineProps(VvRadioProps)
const emit = defineEmits(VvRadioEvents)
const attrs = useAttrs()

//Data
const {
	disabled,
	readonly,
	modelValue: propsModelValue,
	valid,
	error
} = toRefs(props)

//Template References
const input = ref()

//Component computed
const isChecked = computed(() => {
	return checkIsSelected(props.value)
})

// #region group
const groupState = new InputGroupState(VV_RADIO_GROUP, {
	modelValue: propsModelValue,
	disabled,
	readonly
})
const { modelValue, isDisabled, isReadonly, checkIsSelected } =
	useGroupOrLocalState(VV_RADIO_GROUP, groupState)
// #endregion group

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
		disabled: isDisabled,
		readonly: isReadonly
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
	const dataAttrs = ObjectUtilities.pickBy(attrs, (k: string) =>
		k.startsWith('data-')
	)
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
		disabled: isDisabled.value,
		readonly: isReadonly.value,
		checked: isChecked.value,
		...radioInputAriaAttrs.value
	} as InputHTMLAttributes
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
