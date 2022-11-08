<template>
	<div v-bind="vvInputTextProps" :class="inputTextClass">
		<label v-if="label" :for="inputTextId">{{ label }}</label>
		<div class="vv-input-text__wrapper">
			<!-- @slot icon-left to replace icon left -->
			<slot v-if="hasIconLeft" name="icon-left" v-bind="iconSlotProps">
				<vv-icon class="vv-input-text__icon-left" :name="icon" />
			</slot>
			<input
				ref="input"
				v-bind="innerInputProps"
				v-model="inputTextData"
				@input="emit('input', $event)" />
			<!-- autoclear text button -->
			<button
				v-if="autoclear && textLength > 0"
				class="vv-button vv-button--ghost"
				@click="clearInputText">
				<vv-icon name="clear-field" />
			</button>
			<!-- @slot icon-right to replace icon right -->
			<slot name="icon-right" v-bind="iconSlotProps">
				<!-- default password icon -->
				<template v-if="isPassword">
					<div class="vv-input-text__actions-group">
						<button
							class="vv-input-text__action"
							:disabled="isActionsDisabled"
							@click.prevent="toggleShowHidePassword">
							<vv-icon :name="iconRight" />
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
					<vv-icon :name="iconRight" />
				</template>
			</slot>
		</div>
		<HintSlot
			:id="inputTextDescribedBy"
			class="vv-input-text__hint"
			:params="{
				maxlength,
				textLength,
				characterCount
			}" />
	</div>
</template>

<script setup lang="ts">
import {
	computed,
	useAttrs,
	useSlots,
	ref,
	toRefs,
	onMounted,
	type HTMLAttributes,
	type InputHTMLAttributes
} from 'vue'
import ObjectUtilities from '../../utils/ObjectUtilities'
import { VvInputTextEvents, VvInputTextProps } from './VvInputText'

//Componenti
import VvIcon from '../../components/VvIcon/VvIcon.vue'
import HintSlotFactory from '../common/HintSlot'

//Constanti
import INPUT from './constants'

//Composables
import { useInputPassword } from './useInputPassword'
import { useInputNumber } from './useInputNumber'
import { useComponentIcon } from '../../composables/icons/useComponentIcons'
import { useComponentFocus } from '../../composables/focus/useComponentFocus'
import { useDebouncedInput } from '@/composables/debouncedInput/useDebouncedInput'
import { toBem } from '@/composables/useModifiers'

//Props, Emits, Slots e Attrs
const props = defineProps(VvInputTextProps)
const emit = defineEmits(VvInputTextEvents)
const slots = useSlots()
const attrs = useAttrs()

//Template References
const input = ref()

//Data
const {
	disabled,
	readonly,
	type,
	icon,
	iconPosition,
	floating,
	label,
	modelValue,
	maxlength,
	autoclear,
	characterCount
} = toRefs(props)
const inputTextId = props.id || props.name
const inputTextLabeledBy = `${props.name}-label`
const inputTextDescribedBy = `${props.name}-hint`
//BUG - https://www.samanthaming.com/tidbits/88-css-placeholder-shown/
const inputTextPlaceholder = computed(() =>
	props.floating && ObjectUtilities.isEmpty(props.placeholder)
		? ' '
		: props.placeholder
)

//Debounce input
const inputTextData = useDebouncedInput(modelValue, props.debounce, emit)

//Gestione input tipo password
const {
	isPassword,
	isPasswordVisible,
	passwordButtonIcon,
	toggleShowHidePassword
} = useInputPassword(props)

//Gestione input tipo NUMBER
const { isNumber, stepUp, stepDown } = useInputNumber(
	inputTextData,
	input,
	props
)

//Gestione ICONE
const { hasIconLeft, hasIconRight } = useComponentIcon(icon, iconPosition, {
	iconLeft: slots['icon-left'],
	iconRight: slots['icon-right']
})
const iconRight = computed(() => {
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

//Conteggio battute
const textLength = computed(() => {
	return inputTextData.value?.length
})

//Input FOCUS
const { focused } = useComponentFocus(input, emit)

//Component computed
const isActionsDisabled = computed(() => disabled.value || readonly.value)

//Styles & Bindings
const inputTextClass = computed(() => {
	const _hasIconRigth = ObjectUtilities.isNotEmpty(iconRight.value)
	const _isFloating =
		floating.value && ObjectUtilities.isNotEmpty(label?.value)
	const _isDirty = ObjectUtilities.isNotEmpty(modelValue?.value)

	return [
		toBem('vv-input-text', {
			readonly: props.readonly,
			valid: props.valid,
			invalid: props.error,
			loading: props.loading,
			iconLeft: hasIconLeft,
			iconRight: _hasIconRigth,
			floating: _isFloating,
			dirty: _isDirty
		}),
		attrs.class
	]
})
const vvInputTextProps = computed(() => {
	const { style } = attrs
	const dataAttrs = ObjectUtilities.pickBy(attrs, (k: string) =>
		k.startsWith('data-')
	)
	return {
		style,
		...dataAttrs
	} as HTMLAttributes
})
const innerInputProps = computed(() => {
	const _type = isPassword.value && isPasswordVisible.value ? 'text' : type
	const ariaAttrs = ObjectUtilities.pickBy(attrs, (k: string) =>
		k.startsWith('aria-')
	)

	return {
		id: inputTextId,
		type: _type,
		placeholder: inputTextPlaceholder.value,
		name: props.name,
		autocomplete: props.autocomplete,
		disabled: props.disabled,
		readonly: props.readonly,
		minlength: props.minlength,
		maxlength: props.maxlength,
		min: props.min,
		max: props.max,
		step: props.step,
		'aria-invalid': props.error,
		'aria-valid': !props.valid,
		'aria-labeledby': inputTextLabeledBy,
		'aria-describedby': inputTextDescribedBy,
		'aria-errormessage': inputTextDescribedBy,
		...ariaAttrs
	} as InputHTMLAttributes
})

//Slot props
const iconSlotProps = computed(() => {
	const { modelValue, valid, error } = props
	return {
		valid,
		error,
		modelValue
	}
})

//Hint
const HintSlot = HintSlotFactory(props, slots)

//Methods
function clearInputText() {
	inputTextData.value = null
}

onMounted(() => {
	if (props.autofocus) focused.value = true
	console.log('Focused', focused.value)
})
</script>

<script lang="ts">
export default {
	inheritAttrs: false
}
</script>
