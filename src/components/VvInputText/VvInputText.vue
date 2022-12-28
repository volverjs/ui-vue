<script lang="ts">
export default {
	name: 'VvInputText'
}
</script>

<script setup lang="ts">
import {
	computed,
	useSlots,
	ref,
	toRefs,
	onMounted,
	unref,
	type InputHTMLAttributes
} from 'vue'
import { nanoid } from 'nanoid'
import { isEmpty } from '@/utils/ObjectUtilities'
import HintSlotFactory from '@/components/common/HintSlot'
import { useComponentIcon } from '@/composables/icons/useComponentIcons'
import { useComponentFocus } from '@/composables/focus/useComponentFocus'
import { useDebouncedInput } from '@/composables/debouncedInput/useDebouncedInput'
import { useTextLimit } from '@/composables/textLimit/useTextLimit'
import { useBemModifiers } from '@/composables/useModifiers'
import VvIcon from '@/components/VvIcon/VvIcon.vue'
import VvInputTextActionsFactory from '@/components/VvInputText/VvInputTextActions'
import {
	VvInputTextEvents,
	VvInputTextProps,
	INPUT
} from '@/components/VvInputText'

// props, emit, slots and attrs
const props = defineProps(VvInputTextProps)
const emit = defineEmits(VvInputTextEvents)
const slots = useSlots()

// template refs
const input = ref()

// data
const { icon, iconPosition, label, modelValue, limit } = toRefs(props)
const hasId = computed(() => String(props.id || nanoid()))
const hasDescribedBy = computed(() => `${hasId.value}-hint`)
// BUG: https://www.samanthaming.com/tidbits/88-css-placeholder-shown/
const inputTextPlaceholder = computed(() =>
	props.floating && isEmpty(props.placeholder) ? ' ' : props.placeholder
)

// debounce
const localModelValue = useDebouncedInput(modelValue, emit, props.debounce)

// password
const showPassword = ref(false)
const isPassword = computed(() => props.type === INPUT.TYPES.PASSWORD)
const onTogglePassword = () => {
	showPassword.value = !showPassword.value
}

// time, datetime and date
const isDateTime = computed(() =>
	[INPUT.TYPES.TIME, INPUT.TYPES.DATETIME_LOCAL, INPUT.TYPES.DATE].includes(
		props.type
	)
)

// number
const isNumber = computed(() => props.type === INPUT.TYPES.NUMBER)
const onStepUp = () => {
	if (!isDisabled.value) {
		input.value.stepUp()
		localModelValue.value = unref(input).value
	}
}
const onStepDown = () => {
	if (!isDisabled.value) {
		input.value.stepDown()
		localModelValue.value = unref(input).value
	}
}

// search
const isSearch = computed(() => props.type === INPUT.TYPES.SEARCH)
const onClear = () => {
	localModelValue.value = null
}

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
		case INPUT.TYPES.COLOR:
			return { name: INPUT.TYPES_ICON.COLOR }
		case INPUT.TYPES.DATE:
		case INPUT.TYPES.DATETIME_LOCAL:
			return { name: INPUT.TYPES_ICON.DATE }
		case INPUT.TYPES.TIME:
			return { name: INPUT.TYPES_ICON.TIME }
		default:
			return ''
	}
})

// value length
const { formattedTextLimitLength } = useTextLimit(localModelValue, {
	mode: props.limit,
	upperLimit: props.maxlength || 0
})

// focus
const { focused } = useComponentFocus(input, emit)

// disabled
const isDisabled = computed(() => props.disabled || props.readonly)
const hasTabindex = computed(() => (isDisabled.value ? -1 : props.tabindex))

// dirty
const isDirty = computed(() => !isEmpty(modelValue))

// invalid
const isInvalid = computed(() => {
	if (props.error === true) {
		return true
	}
	if (props.valid === true) {
		return false
	}
	return undefined
})

// styles
const { bemCssClasses } = useBemModifiers('vv-input-text', {
	modifiers: props.modifiers,
	valid: props.valid,
	invalid: props.error,
	loading: props.loading,
	iconLeft: hasIconLeft,
	iconRight: hasIconRight.value || !isEmpty(defaultRightIcon),
	floating: props.floating && !isEmpty(props.label),
	dirty: isDirty,
	focus: focused
})

// attrs
const hasAttrs = computed(() => {
	const type = (() => {
		if (isPassword.value && showPassword.value) {
			return INPUT.TYPES.TEXT
		}
		if (isDateTime.value && !isDirty.value && !focused.value) {
			return INPUT.TYPES.TEXT
		}
		return props.type
	})()
	return {
		type,
		placeholder: inputTextPlaceholder.value,
		name: props.name,
		autocomplete: props.autocomplete,
		minlength: props.minlength,
		maxlength: props.maxlength,
		min: props.min,
		max: props.max,
		step: type === INPUT.TYPES.NUMBER ? props.step : undefined,
		tabindex: hasTabindex.value,
		'aria-invalid': isInvalid.value,
		'aria-describedby':
			!hasErrors.value && hasHint.value
				? hasDescribedBy.value
				: undefined,
		'aria-errormessage': hasErrors.value ? hasDescribedBy.value : undefined
	} as InputHTMLAttributes
})

// slots
const iconSlotProps = computed(() => ({
	valid: props.valid,
	error: props.error,
	modelValue: props.modelValue
}))

// components
const { HintSlot, hasHint, hasErrors } = HintSlotFactory(props, slots)
const PasswordInputActions = VvInputTextActionsFactory(
	INPUT.TYPES.PASSWORD,
	props
)
const NumberInputActions = VvInputTextActionsFactory(INPUT.TYPES.NUMBER, props)
const SearchInputActions = VvInputTextActionsFactory(INPUT.TYPES.SEARCH, props)

// lifecycle
onMounted(() => {
	if (props.autofocus) {
		focused.value = true
	}
})
</script>

<template>
	<div :class="bemCssClasses">
		<label v-if="label" :for="hasId" class="vv-input-text__label">
			{{ label }}
		</label>
		<div class="vv-input-text__wrapper">
			<!-- @slot icon-left to replace icon left -->
			<slot v-if="hasIconLeft" name="icon-left" v-bind="iconSlotProps">
				<VvIcon class="vv-input-text__icon-left" v-bind="hasIcon" />
			</slot>
			<input
				:id="hasId"
				ref="input"
				v-model="localModelValue"
				v-bind="hasAttrs"
				:disabled="disabled"
				:readonly="readonly"
				:required="required"
				@keyup="emit('keyup', $event)" />
			<!-- @slot icon-right to replace icon right -->
			<slot name="icon-right" v-bind="iconSlotProps">
				<VvIcon
					v-if="hasIconRight || defaultRightIcon"
					v-bind="hasIconRight ? hasIcon : defaultRightIcon" />
				<PasswordInputActions
					v-else-if="isPassword"
					@toggle-password="onTogglePassword" />
				<NumberInputActions
					v-else-if="isNumber"
					@step-up="onStepUp"
					@step-down="onStepDown" />
				<SearchInputActions v-else-if="isSearch" @clear="onClear" />
			</slot>
			<span v-if="limit" class="vv-input-text__limit">
				<slot name="limit"> {{ formattedTextLimitLength }} </slot>
			</span>
		</div>
		<HintSlot :id="hasDescribedBy" class="vv-input-text__hint" />
	</div>
</template>
