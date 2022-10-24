<template>
	<div v-bind="inputTextAttrs" :class="inputTextClass">
		<label v-if="label" :for="inputAttrs.id">{{ label }}</label>
		<div class="vv-input-text__wrapper">
			<!-- @slot icon-left to replace icon left -->
			<slot v-if="hasIconLeft" name="icon-left" v-bind="iconSlotProps">
				<vv-icon class="vv-input-text__icon-left" :name="icon" />
			</slot>
			<input ref="input" v-bind="inputAttrs" v-model="inputTextData" />
			<!-- @slot icon-password-on-off to replace icon show/hide password -->
			<slot
				v-if="isPassword"
				name="icon-password-on-off"
				v-bind="iconSlotProps">
				<button
					class="vv-input-text__actions"
					@click.prevent="toggleShowHidePassword">
					<div class="vv-input-text__actions-group">
						<vv-icon :name="currentPasswordIcon" />
					</div>
				</button>
			</slot>
			<!-- @slot icon-calendar to replace icon calendar -->
			<slot
				v-else-if="isDate"
				name="icon-calendar"
				v-bind="iconSlotProps">
				<div class="vv-input-text__actions-group">
					<vv-icon
						class="vv-input-text__icon-right"
						name="calendar" />
				</div>
			</slot>
			<slot v-else-if="isNumber">
				<div class="vv-input-text__actions-group">
					<button
						id="textfield-number-increment"
						type="button"
						class="vv-input-text__action-chevron vv-input-text__action-chevron-up"
						@click.prevent="stepUp()"></button>
					<button
						id="textfield-number-decrement"
						type="button"
						class="vv-input-text__action-chevron"
						@click.prevent="stepDown()"></button>
				</div>
			</slot>
			<!-- @slot icon-right to replace icon left -->
			<slot
				v-else-if="hasIconRight"
				name="icon-right"
				v-bind="iconSlotProps">
				<div class="vv-input-text__actions-group">
					<vv-icon class="vv-input-text__icon-right" :name="icon" />
				</div>
			</slot>
		</div>
		<HintSlot
			:id="inputAriaAttrs['aria-describedby']"
			class="vv-input-text__hint" />
	</div>
</template>

<script setup lang="ts">
import { shallowRef, unref, type InputHTMLAttributes } from 'vue'
import { computed, useAttrs, useSlots, ref } from 'vue'
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
		validator: (value: string) =>
			['text', 'password', 'date', 'datetime-local', 'number'].indexOf(
				value
			) > -1
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
		validation: (value: string) => ['left', 'right'].indexOf(value) > -1,
		default: 'right'
	},
	/**
	 * True = label flottante
	 */
	floating: Boolean
})
const emit = defineEmits(['update:modelValue'])

const input = ref()
const inputTextData = useVModel(props, 'modelValue', emit)
const { hasIconLeft, hasIconRight } = useIcons(props, { slots })
const { isInvalid, isValid } = useValidationState(props, { emit })

//Computed
const isDirty = computed(() => ObjectUtilities.isNotEmpty(inputTextData?.value))
const isPassword = computed(() => props.type === 'password')
const isDate = computed(() => ['date', 'datetime-local'].includes(props.type))
const isNumber = computed(() => props.type === 'number')
const inputType = computed(() => {
	if (props.type === 'password')
		return bHidePassword.value ? 'password' : 'text'

	return props.type
})
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
		autocomplete,
		minlength,
		maxlength,
		min,
		max,
		step
	} = attrs as InputHTMLAttributes

	const { disabled, readonly } = props

	return {
		type: inputType.value,
		id: id || name,
		name,
		placeholder,
		autocomplete: autocomplete || 'off',
		disabled,
		readonly,
		minlength,
		maxlength,
		min,
		max,
		step,
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

//Gestione password field
const bHidePassword = ref(true)
const currentPasswordIcon = computed(() =>
	bHidePassword.value ? 'eye-on' : 'eye-off'
)
const toggleShowHidePassword = () => {
	bHidePassword.value = !bHidePassword.value
}

//Gestione numeric field
function stepUp() {
	input.value.stepUp()
	inputTextData.value = unref(input.value).value
}
function stepDown() {
	input.value.stepDown()
	inputTextData.value = unref(input.value).value
}

const HintSlot = shallowRef(HintSlotFactory(props, slots))
</script>

<script lang="ts">
export default {
	inheritAttrs: false
}
</script>

<style lang="scss">
@import '@volverjs/style/scss/components/vv-input-text';
</style>
