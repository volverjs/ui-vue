<script lang="ts">
export default {
	name: 'VvInputText',
	inheritAttrs: false
}
</script>

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
import { nanoid } from 'nanoid'
import { isEmpty, pickBy } from '@/utils/ObjectUtilities'
import { VvInputTextEvents, VvInputTextProps } from './VvInputText'

// components
import VvIcon from '@/components/VvIcon/VvIcon.vue'
import HintSlotFactory from '../common/HintSlot'
import VvInputTextActionsFactory from './VvInputTextActions'

// constants
import INPUT from './constants'

// composable
import { useComponentIcon } from '@/composables/icons/useComponentIcons'
import { useComponentFocus } from '@/composables/focus/useComponentFocus'
import { useDebouncedInput } from '@/composables/debouncedInput/useDebouncedInput'
import { useTextLimit } from '@/composables/textLimit/useTextLimit'
import { toBem } from '@/composables/useModifiers'

// props, emits, slots and attrs
const props = defineProps(VvInputTextProps)
const emit = defineEmits(VvInputTextEvents)
const slots = useSlots()
const attrs = useAttrs()

// template refs
const input = ref()

// data
const { icon, iconPosition, label, modelValue, autoclear, limit } =
	toRefs(props)
const inputTextId = (attrs.id as string) || nanoid()
const inputTextLabeledBy = `${inputTextId}-label`
const inputTextDescribedBy = `${inputTextId}-hint`
// BUG: https://www.samanthaming.com/tidbits/88-css-placeholder-shown/
const inputTextPlaceholder = computed(() =>
	props.floating && isEmpty(props.placeholder) ? ' ' : props.placeholder
)

// debounce
const inputTextData = useDebouncedInput(modelValue, emit, props.debounce)

// password
const showPassword = ref(false)
const isPassword = computed(() => props.type === INPUT.TYPES.PASSWORD)

// time, datetime and date
const isDateTime = computed(() =>
	[INPUT.TYPES.TIME, INPUT.TYPES.DATETIME_LOCAL, INPUT.TYPES.DATE].includes(
		props.type
	)
)

// number
const isNumber = computed(() => props.type === INPUT.TYPES.NUMBER)
function stepUp() {
	if (!isDisabled.value) {
		input.value.stepUp()
		inputTextData.value = unref(input).value
	}
}
function stepDown() {
	if (!isDisabled.value) {
		input.value.stepDown()
		inputTextData.value = unref(input).value
	}
}

// search
const isSearch = computed(() => props.type === INPUT.TYPES.SEARCH)

// icons
const { hasIconLeft, hasIconRight } = useComponentIcon(icon, iconPosition, {
	iconLeft: slots['icon-left'],
	iconRight: slots['icon-right']
})
const hasIcon = computed(() => {
	if (typeof icon.value === 'string') {
		return { name: icon.value }
	}
	return icon.value
})
const defaultRightIcon = computed(() => {
	switch (props.type) {
		case INPUT.TYPES.PASSWORD:
			return { name: INPUT.TYPES_ICON.PASSWORD_OFF }
		case INPUT.TYPES.COLOR:
			return { name: INPUT.TYPES_ICON.COLOR }
		case INPUT.TYPES.DATE:
		case INPUT.TYPES.DATETIME_LOCAL:
			return { name: INPUT.TYPES_ICON.DATE }
		case INPUT.TYPES.TIME:
			return { name: INPUT.TYPES_ICON.TIME }
		case INPUT.TYPES.SEARCH:
			return { name: INPUT.TYPES_ICON.SEARCH }
		default:
			return ''
	}
})

// value length
const { textLength, formattedTextLimitLength } = useTextLimit(inputTextData, {
	mode: props.limit,
	upperLimit: props.maxlength || 0
})

// focus
const { focused: isFocused } = useComponentFocus(input, emit)
defineExpose({
	focus: () => {
		isFocused.value = true
	},
	blur: () => {
		isFocused.value = false
	}
})

// disabled
const isDisabled = computed(() => props.disabled || props.readonly)

// dirty
const isDirty = computed(() => !isEmpty(modelValue))

// styles & bindings
const hasClass = computed(() => [
	toBem('vv-input-text', {
		modifiers: props.modifiers,
		readonly: props.readonly,
		valid: props.valid,
		invalid: props.error,
		loading: props.loading,
		iconLeft: hasIconLeft,
		iconRight: hasIconRight.value || !isEmpty(defaultRightIcon),
		floating: props.floating && !isEmpty(props.label),
		dirty: isDirty,
		focus: isFocused
	}),
	attrs.class
])

const getType = () => {
	if (isPassword.value && showPassword.value) {
		return INPUT.TYPES.TEXT
	}
	if (isDateTime.value && !isDirty.value && !isFocused.value) {
		return INPUT.TYPES.TEXT
	}
	return props.type
}

const getAriaAttributes = () => {
	return {
		'aria-invalid': props.error,
		'aria-valid': !props.valid,
		'aria-labeledby': inputTextLabeledBy,
		'aria-describedby': inputTextDescribedBy,
		'aria-errormessage': inputTextDescribedBy,
		...pickBy(attrs, (attr: string) => attr.startsWith('aria-'))
	}
}

const getDataAttributes = () => {
	return {
		...pickBy(attrs, (attr: string) => attr.startsWith('data-'))
	}
}

const wrapperProps = computed(
	() =>
		({
			style: attrs.style,
			class: hasClass.value,
			...getDataAttributes()
		} as HTMLAttributes)
)

const inputProps = computed(() => {
	return {
		id: inputTextId,
		type: getType(),
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
		tabindex: attrs.tabindex ?? props.disabled ? -1 : 0,
		...getAriaAttributes()
	} as InputHTMLAttributes
})

// slots
const iconSlotProps = computed(() => {
	const { modelValue, valid, error } = props
	return {
		valid,
		error,
		modelValue
	}
})

// components
const HintSlot = HintSlotFactory(props, slots)
const PasswordInputActions = VvInputTextActionsFactory(
	INPUT.TYPES.PASSWORD,
	props
)
const NumberInputActions = VvInputTextActionsFactory(INPUT.TYPES.NUMBER, props)

// methods
function clearInputText() {
	inputTextData.value = null
}

// lifecycle
onMounted(() => {
	if (props.autofocus) {
		isFocused.value = true
	}
})
</script>

<template>
	<div v-bind="wrapperProps">
		<label v-if="label" :id="inputTextLabeledBy" :for="inputTextId">
			{{ label }}
		</label>
		<div class="vv-input-text__wrapper">
			<!-- @slot icon-left to replace icon left -->
			<slot v-if="hasIconLeft" name="icon-left" v-bind="iconSlotProps">
				<VvIcon class="vv-input-text__icon-left" v-bind="hasIcon" />
			</slot>
			<input
				ref="input"
				v-bind="inputProps"
				v-model="inputTextData"
				@keyup="emit('keyup', $event)" />
			<!-- autoclear text button -->
			<button
				v-if="autoclear && textLength > 0"
				class="vv-button vv-button--ghost"
				@click="clearInputText">
				<VvIcon name="clear-field" />
			</button>
			<!-- @slot icon-right to replace icon right -->
			<slot name="icon-right" v-bind="iconSlotProps">
				<PasswordInputActions
					v-if="isPassword"
					@action-password-on="showPassword = true"
					@action-password-off="showPassword = false" />
				<NumberInputActions
					v-else-if="isNumber"
					@action-step-up="stepUp"
					@action-step-down="stepDown" />
				<VvIcon
					v-if="isSearch && (isDirty || hasIconRight)"
					v-bind="isDirty ? defaultRightIcon : hasIcon" />
				<VvIcon
					v-else-if="hasIconRight || defaultRightIcon"
					v-bind="hasIconRight ? hasIcon : defaultRightIcon" />
			</slot>
			<span v-if="limit" class="vv-input-text__limit">
				<slot name="limit"> {{ formattedTextLimitLength }} </slot>
			</span>
		</div>
		<HintSlot :id="inputTextDescribedBy" class="vv-input-text__hint" />
	</div>
</template>
