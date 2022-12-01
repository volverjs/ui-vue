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
				<template v-if="isPassword">
					<PasswordInputActions
						@action-password-on="showPassword = true"
						@action-password-off="showPassword = false" />
				</template>
				<template v-else-if="isNumber">
					<NumberInputActions
						@action-step-up="stepUp"
						@action-step-down="stepDown" />
				</template>
				<template v-else-if="hasIconRight || defaultRightIcon">
					<vv-icon :name="icon || defaultRightIcon" />
				</template>
			</slot>
			<span v-if="limit" class="vv-input-text__limit">
				<slot name="limit"> {{ formattedTextLimitLength }} </slot>
			</span>
		</div>
		<HintSlot :id="inputTextDescribedBy" class="vv-input-text__hint" />
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
	unref,
	type HTMLAttributes,
	type InputHTMLAttributes
} from 'vue'
import ObjectUtilities from '../../utils/ObjectUtilities'
import { VvInputTextEvents, VvInputTextProps } from './VvInputText'

//Componenti
import VvIcon from '../../components/VvIcon/VvIcon.vue'
import HintSlotFactory from '../common/HintSlot'
import VvInputTextActionsFactory from './VvInputTextActions'

//Constanti
import INPUT from './constants'

//Composables
import { useComponentIcon } from '../../composables/icons/useComponentIcons'
import { useComponentFocus } from '../../composables/focus/useComponentFocus'
import { useDebouncedInput } from '../../composables/debouncedInput/useDebouncedInput'
import { useTextLimit } from '../../composables/textLimit/useTextLimit'
import { toBem } from '@/composables/useModifiers'

//Props, Emits, Slots e Attrs
const props = defineProps(VvInputTextProps)
const emit = defineEmits(VvInputTextEvents)
const slots = useSlots()
const attrs = useAttrs()

//Template References
const input = ref()

//Data
const { icon, iconPosition, label, modelValue, autoclear, limit } =
	toRefs(props)
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
const showPassword = ref(false)
const isPassword = computed(() => props.type === INPUT.TYPES.PASSWORD)

//Gestione input tipo NUMBER
const isNumber = computed(() => props.type === INPUT.TYPES.NUMBER)
function stepUp() {
	const value = Number(unref(input.value).value)
	if (
		isNaN(value) ||
		isActionsDisabled.value ||
		(props.max && value + props.step > props.max)
	)
		return

	input.value.stepUp()
	inputTextData.value = Number(unref(input.value).value)
}
function stepDown() {
	const value = Number(unref(input.value).value)
	if (
		isNaN(value) ||
		isActionsDisabled.value ||
		(props.min && value - props.step < props.min)
	)
		return

	input.value.stepDown()
	inputTextData.value = Number(unref(input.value).value)
}

//Gestione ICONE
const { hasIconLeft, hasIconRight } = useComponentIcon(icon, iconPosition, {
	iconLeft: slots['icon-left'],
	iconRight: slots['icon-right']
})
const defaultRightIcon = computed(() => {
	switch (props.type) {
		case INPUT.TYPES.PASSWORD:
			return INPUT.TYPES_ICON.PASSWORD_OFF
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
const { textLength, formattedTextLimitLength } = useTextLimit(inputTextData, {
	mode: props.limit,
	upperLimit: props.maxLength || 0
})

//Input FOCUS
const { focused } = useComponentFocus(input, emit)

//Component computed
const isActionsDisabled = computed(() => props.disabled || props.readonly)

//Styles & Bindings
const inputTextClass = computed(() => {
	const _hasIconRigth =
		hasIconRight.value || ObjectUtilities.isNotEmpty(defaultRightIcon.value)
	const _isFloating =
		props.floating && ObjectUtilities.isNotEmpty(props.label)
	const _isDirty = ObjectUtilities.isNotEmpty(modelValue?.value)

	return [
		toBem('vv-input-text', {
			modifiers: props.modifiers,
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
	const _type = isPassword.value && showPassword.value ? 'text' : props.type
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
		minLength: props.minLength,
		maxLength: props.maxLength,
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

//Other components
const HintSlot = HintSlotFactory(props, slots)
const PasswordInputActions = VvInputTextActionsFactory(
	INPUT.TYPES.PASSWORD,
	props
)
const NumberInputActions = VvInputTextActionsFactory(INPUT.TYPES.NUMBER, props)

//Methods
function clearInputText() {
	inputTextData.value = null
}

onMounted(() => {
	if (props.autofocus) focused.value = true
})
</script>

<script lang="ts">
export default {
	inheritAttrs: false
}
</script>
