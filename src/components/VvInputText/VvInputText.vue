<template>
	<div v-bind="inputTextAttrs" :class="inputTextClass">
		<label :for="inputAttrs.id" v-if="label">{{ label }}</label>
		<div class="vv-input-text__wrapper">
			<!-- @slot icon-left to replace icon left -->
			<slot name="icon-left" v-if="hasIconLeft" v-bind="iconSlotProps">
				<vv-icon class="vv-input-text__icon-left" :name="icon" />
			</slot>
			<input v-bind="inputAttrs" v-model="inputTextData" />
			<!-- @slot icon-right to replace icon left -->
			<slot name="icon-right" v-if="hasIconRight" v-bind="iconSlotProps">
				<vv-icon class="vv-input-text__icon-right" :name="icon" />
			</slot>
		</div>
		<HintSlot
			:id="inputAriaAttrs['aria-describedby']"
			class="vv-input-text__hint" />
	</div>
</template>

<script setup lang="ts">
import type { InputHTMLAttributes } from 'vue'
import { computed, useAttrs, useSlots } from 'vue'
import { useVModel } from '@vueuse/core'
import { useValidationState } from '../../composables/validation/useValidationState'
import { useIcons } from '../../composables/icons/useIcons'
import ObjectUtilities from '../../utils/ObjectUtilities'

import VvIcon from '../../components/VvIcon/VvIcon.vue'
import { HintSlotFactory } from '../common/HintSlot'

const slots = useSlots()
const attrs = useAttrs()
const props = defineProps({
	modelValue: null,
	type: {
		type: String,
		default: 'text',
		validator: (value: string) => ['text', 'password'].indexOf(value) > -1
	},
	label: String,
	disabled: Boolean,
	readonly: Boolean,
	hintLabel: { type: String, default: '' },
	valid: Boolean,
	validLabel: [String, Array],
	error: Boolean,
	errors: [String, Array],
	loading: Boolean,
	loadingLabel: String,
	/**
	 * Nome dell'icona
	 * @see DsIcon
	 */
	icon: { type: String, default: '' },
	/**
	 * Posizione dell'icona
	 */
	iconPosition: {
		type: String,
		validation: (value: string) => ['left', 'right'].indexOf(value) > -1
	},
	/**
	 * True = label flottante
	 */
	floating: Boolean
})
const emit = defineEmits(['update:modelValue'])

const inputTextData = useVModel(props, 'modelValue', emit)
const { hasIconLeft, hasIconRight } = useIcons(props, { slots })
const { isInvalid, isValid } = useValidationState(props, { emit })

//Computed
const isDirty = computed(() => ObjectUtilities.isNotEmpty(inputTextData?.value))
const inputTextClass = computed(() => {
	const { class: cssClass } = attrs
	return {
		'vv-input-text': true,
		'vv-input-text--readonly': props.readonly,
		'vv-input-text--valid': isValid.value,
		'vv-input-text--invalid': isInvalid.value,
		'vv-input-text--loading': props.loading,
		'vv-input-text--icon-left': hasIconLeft.value,
		'vv-input-text--icon-right': hasIconRight.value,
		'vv-input-text--floating':
			props.floating && ObjectUtilities.isNotEmpty(props.label),
		'vv-input-text--dirty': isDirty.value,
		class: cssClass
	}
})
const inputTextAttrs = computed(() => {
	const { style } = attrs
	const dataAttrs = ObjectUtilities.pickBy(attrs, (k: string) =>
		k.startsWith('data-')
	)
	return {
		style,
		...dataAttrs
	}
})
const inputAttrs = computed(() => {
	const {
		id = '',
		name = '',
		placeholder = '',
		autocomplete
	} = attrs as InputHTMLAttributes

	const { disabled, readonly, type } = props

	return {
		type,
		id: id || name,
		name,
		placeholder,
		autocomplete,
		disabled,
		readonly,
		...inputAriaAttrs.value
	}
})
const inputAriaAttrs = computed(() => {
	const { name } = attrs
	const dataAttrs = ObjectUtilities.pickBy(attrs, (k: string) =>
		k.startsWith('aria-')
	)
	return {
		'aria-label': name,
		'aria-describedby': `${name}-hint`,
		'aria-invalid': isInvalid.value,
		...dataAttrs
	}
})
const iconSlotProps = computed(() => {
	const { modelValue } = props
	return {
		isValid,
		isInvalid,
		modelValue
	}
})

const HintSlot = HintSlotFactory(props, slots)
</script>

<script lang="ts">
export default {
	inheritAttrs: false
}
</script>

<style lang="scss">
@import '@volverjs/style/scss/components/vv-input-text';
</style>
