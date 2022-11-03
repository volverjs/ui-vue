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
				v-model="inputTextData"
				@input="emit('input', $event)" />
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
import {
	computed,
	useAttrs,
	useSlots,
	ref,
	toRefs,
	onMounted,
	watch,
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
import { refDebounced } from '@vueuse/core'
import { useInputPassword } from './useInputPassword'
import { useInputNumber } from './useInputNumber'
import { useComponentIcons } from '../../composables/icons/useComponentIcons'
import { useComponentFocus } from '../../composables/focus/useComponentFocus'
import { useBemModifiers } from '@/composables/useModifiers'

//Props, Emits, Slots e Attrs
const props = defineProps(VvInputTextProps)
const emit = defineEmits(VvInputTextEvents)
const slots = useSlots()
const attrs = useAttrs()

//Template References
const input = ref()

//Data
const inputTextData = ref(props.modelValue)
const {
	disabled,
	readonly,
	type,
	icon,
	iconPosition,
	valid,
	error,
	loading,
	floating,
	label,
	modelValue
} = toRefs(props)

//Component computed
const isActionsDisabled = computed(() => disabled.value || readonly.value)

//Debounce
const debouncedInputTextData = refDebounced(inputTextData, props.debounce || 0)
watch(debouncedInputTextData, (v) => emit('update:modelValue', v))

//Gestione ICONE
const iconProps = { icon, iconPosition }
const iconSlots = {
	iconLeft: slots['icon-left'],
	iconRight: slots['icon-right']
}
const { hasIconLeft, hasIconRight } = useComponentIcons(iconProps, iconSlots)
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
const inputPswProps = {
	type,
	disabled,
	readonly
}
const {
	isPassword,
	isPasswordVisible,
	passwordButtonIcon,
	toggleShowHidePassword
} = useInputPassword(inputPswProps)

//Gestione input tipo NUMBER
const inputNumberProps = {
	disabled,
	readonly,
	type,
	inputTemplateRef: input
}
const { isNumber, stepUp, stepDown } = useInputNumber(
	inputTextData,
	inputNumberProps
)

//Input FOCUS
const { focused } = useComponentFocus(input, emit)

//Styles & Bindings
const { bemCssClasses: bemInputClass } = useBemModifiers('vv-input-text', {
	readonly,
	valid,
	invalid: error,
	loading,
	iconLeft: hasIconLeft,
	iconRight: computed(() => ObjectUtilities.isNotEmpty(inputRightIcon.value)),
	floating: computed(
		() => floating.value && ObjectUtilities.isNotEmpty(label?.value)
	),
	dirty: computed(() => ObjectUtilities.isNotEmpty(modelValue))
})
const vvInputInputClass = computed(() => {
	const { class: cssClass } = attrs
	return {
		class: cssClass,
		...bemInputClass.value
	}
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
	} as InputHTMLAttributes
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
