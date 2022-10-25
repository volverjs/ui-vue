<template>
	<div v-bind="vvInputTextProps" :class="vvInputInputClass">
		<label v-if="label" :for="innerInputProps.id">{{ label }}</label>
		<div class="vv-input-text__wrapper">
			<!-- @slot icon-left to replace icon left -->
			<slot v-if="hasIconLeft" name="icon-left" v-bind="iconSlotProps">
				<vv-icon class="vv-input-text__icon-left" :name="icon" />
			</slot>
			<input
				ref="input"
				v-bind="innerInputProps"
				v-model="inputTextData" />
			<!-- @slot icon-right to replace icon right -->
			<slot name="icon-right" v-bind="iconSlotProps">
				<!-- default password icon -->
				<template v-if="isPassword">
					<div class="vv-input-text__actions-group">
						<button
							class="vv-input-text__action"
							:disabled="isActionsDisabled"
							@click.prevent="toggleShowHidePassword">
							<vv-icon :name="inputRightIcon" />
						</button>
					</div>
				</template>
				<!-- default number icon -->
				<template v-else-if="isNumber">
					<div class="vv-input-text__actions-group">
						<button
							type="button"
							class="vv-input-text__action-chevron vv-input-text__action-chevron-up"
							:disabled="isActionsDisabled"
							@click.prevent="stepUp()"></button>
						<button
							type="button"
							class="vv-input-text__action-chevron"
							:disabled="isActionsDisabled"
							@click.prevent="stepDown()"></button>
					</div>
				</template>
				<!-- default icon -->
				<template v-else>
					<vv-icon :name="inputRightIcon" />
				</template>
			</slot>
		</div>
		<HintSlot
			:id="inputAriaAttrs['aria-describedby']"
			class="vv-input-text__hint" />
	</div>
</template>

<script setup lang="ts">
import { computed, useAttrs, useSlots, ref, shallowRef, toRefs } from 'vue'
import ObjectUtilities from '../../utils/ObjectUtilities'

//Componenti
import VvIcon from '../../components/VvIcon/VvIcon.vue'
import HintSlotFactory from '../common/HintSlot'

//Constanti
import INPUT from './constants'

//Composables
import { useVModel } from '@vueuse/core'
import { useInputPassword } from './useInputPassword'
import { useInputNumber } from './useInputNumber'
import { useComponentIcons } from '../../composables/icons/useIcons'

//Props, Emits, Slots e Attrs
const props = defineProps({
	modelValue: null,
	type: {
		type: String,
		default: INPUT.TYPES.TEXT,
		validator: (value: string) => Object.values(INPUT.TYPES).includes(value)
	},
	id: String,
	name: { type: String, required: true },
	autocomplete: { type: String, default: 'off' },
	minlength: Number,
	maxlength: Number,
	min: [Number, Date],
	max: [Number, Date],
	step: Number,
	label: String,
	disabled: Boolean,
	readonly: Boolean,
	placeholder: String,
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
		validation: (value: string) =>
			Object.values(INPUT.ICON_POSITIONS).includes(value),
		default: INPUT.ICON_POSITIONS.RIGHT
	},
	/**
	 * True = label flottante
	 */
	floating: Boolean
})
const emit = defineEmits(INPUT.EVENTS)
const slots = useSlots()
const attrs = useAttrs()

//Template References
const input = ref()

//Data
const inputTextData = useVModel(props, 'modelValue', emit)
const { disabled, readonly, type } = toRefs(props)

//Generic computed
const isActionsDisabled = computed(() => disabled.value || readonly.value)

//Gestione ICONE
const { hasIconLeft, hasIconRight } = useComponentIcons(props, {
	iconLeft: slots['icon-left'],
	iconRight: slots['icon-right']
})
const inputRightIcon = computed(() => {
	if (hasIconRight.value) return props.icon

	switch (props.type) {
		case INPUT.TYPES.PASSWORD:
			return passwordButtonIcon.value
		case INPUT.TYPES.COLOR:
			return INPUT.TYPES_ICON.COLOR
		case INPUT.TYPES.DATE:
		case INPUT.TYPES.DATETIME_LOCAL:
			return INPUT.TYPES_ICON.DATE
		case INPUT.TYPES.TIME:
			return INPUT.TYPES_ICON.TIME
		case INPUT.TYPES.SEARCH:
			return INPUT.TYPES_ICON.SEARCH
		default:
			return ''
	}
})
//Gestione input tipo password
const {
	isPassword,
	isPasswordVisible,
	passwordButtonIcon,
	toggleShowHidePassword
} = useInputPassword({
	type,
	disabled,
	readonly
})
//Gestione input tipo NUMBER
const { isNumber, stepUp, stepDown } = useInputNumber(inputTextData, {
	disabled,
	readonly,
	type,
	inputTemplateRef: input
})

//Styles & Bindings
const vvInputTextProps = computed(() => {
	const { style } = attrs
	const dataAttrs = ObjectUtilities.pickBy(attrs, (k: string) =>
		k.startsWith('data-')
	)
	return {
		style,
		...dataAttrs
	}
})
const vvInputInputClass = computed(() => {
	const { class: cssClass } = attrs
	return {
		'vv-input-text': true,
		'vv-input-text--readonly': props.readonly,
		'vv-input-text--valid': props.valid,
		'vv-input-text--invalid': props.error,
		'vv-input-text--loading': props.loading,
		'vv-input-text--icon-left': hasIconLeft.value,
		'vv-input-text--icon-right': ObjectUtilities.isNotEmpty(
			inputRightIcon.value
		),
		'vv-input-text--floating':
			props.floating && ObjectUtilities.isNotEmpty(props.label),
		'vv-input-text--dirty': ObjectUtilities.isNotEmpty(props.modelValue),
		class: cssClass
	}
})
const innerInputProps = computed(() => {
	const {
		id,
		name,
		type,
		autocomplete,
		minlength,
		maxlength,
		min,
		max,
		step,
		disabled,
		readonly,
		floating,
		placeholder
	} = props

	const _id = id || name
	const _type = isPassword.value && isPasswordVisible.value ? 'text' : type
	//BUG - https://www.samanthaming.com/tidbits/88-css-placeholder-shown/
	const _placeholder =
		floating && ObjectUtilities.isEmpty(placeholder)
			? ' '
			: attrs.placeholder

	return {
		id: _id,
		type: _type,
		placeholder: _placeholder,
		name,
		autocomplete,
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
	const ariaAttrs = ObjectUtilities.pickBy(attrs, (k: string) =>
		k.startsWith('aria-')
	)
	return {
		'aria-label': name,
		'aria-describedby': `${name}-hint`,
		'aria-invalid': props.error,
		...ariaAttrs
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
