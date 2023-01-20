<script lang="ts">
	export default {
		name: 'VvInputText',
	}
</script>

<script setup lang="ts">
	import type { InputHTMLAttributes } from 'vue'
	import { nanoid } from 'nanoid'
	import HintSlotFactory from '@/components/common/HintSlot'
	import VvIcon from '@/components/VvIcon/VvIcon.vue'
	import VvInputTextActionsFactory from '@/components/VvInputText/VvInputTextActions'
	import {
		VvInputTextEvents,
		VvInputTextProps,
		INPUT_TYPES,
		TYPES_ICON,
	} from '@/components/VvInputText'

	// props, emit, slots and attrs
	const props = defineProps(VvInputTextProps)
	const emit = defineEmits(VvInputTextEvents)
	const slots = useSlots()

	// template refs
	const input = ref()

	// data
	const {
		icon,
		iconPosition,
		label,
		modelValue,
		count,
		valid,
		invalid,
		loading,
	} = toRefs(props)
	const hasId = computed(() => String(props.id || nanoid()))
	const hasDescribedBy = computed(() => `${hasId.value}-hint`)
	// BUG: https://www.samanthaming.com/tidbits/88-css-placeholder-shown/
	const inputTextPlaceholder = computed(() =>
		props.floating && isEmpty(props.placeholder) ? ' ' : props.placeholder,
	)

	// debounce
	const localModelValue = useDebouncedInput(modelValue, emit, props.debounce)

	// focus
	const { focused } = useComponentFocus(input, emit)

	// visibility
	const isVisible = useElementVisibility(input)
	watch(isVisible, (newValue) => {
		if (newValue && props.autofocus) {
			focused.value = true
		}
	})

	// password
	const showPassword = ref(false)
	const isPassword = computed(() => props.type === INPUT_TYPES.PASSWORD)
	const onTogglePassword = () => {
		showPassword.value = !showPassword.value
	}

	// time, datetime and date
	const isDateTime = computed(
		() =>
			props.type === INPUT_TYPES.TIME ||
			props.type === INPUT_TYPES.DATETIME_LOCAL ||
			props.type === INPUT_TYPES.DATE ||
			props.type === INPUT_TYPES.WEEK ||
			props.type === INPUT_TYPES.MONTH,
	)

	// number
	const isNumber = computed(() => props.type === INPUT_TYPES.NUMBER)
	const onStepUp = () => {
		if (isClickable.value) {
			input.value.stepUp()
			localModelValue.value = unref(input).value
		}
	}
	const onStepDown = () => {
		if (isClickable.value) {
			input.value.stepDown()
			localModelValue.value = unref(input).value
		}
	}

	// search
	const isSearch = computed(() => props.type === INPUT_TYPES.SEARCH)
	const onClear = () => {
		localModelValue.value = undefined
	}

	// icons
	const { hasIconLeft, hasIconRight, hasIcon } = useComponentIcon(
		icon,
		iconPosition,
	)
	const defaultRightIcon = computed(() => {
		switch (props.type) {
			case INPUT_TYPES.COLOR:
				return { name: TYPES_ICON.COLOR }
			case INPUT_TYPES.DATE:
			case INPUT_TYPES.DATETIME_LOCAL:
			case INPUT_TYPES.WEEK:
			case INPUT_TYPES.MONTH:
				return { name: TYPES_ICON.DATE }
			case INPUT_TYPES.TIME:
				return { name: TYPES_ICON.TIME }
			default:
				return ''
		}
	})

	// count
	const { formatted: countFormatted } = useTextCount(localModelValue, {
		mode: props.count,
		upperLimit: props.maxlength,
		lowerLimit: props.minlength,
	})

	// tabindex
	const isClickable = computed(() => !props.disabled && !props.readonly)
	const hasTabindex = computed(() =>
		isClickable.value ? props.tabindex : -1,
	)

	// dirty
	const isDirty = computed(() => !isEmpty(modelValue))

	// invalid
	const isInvalid = computed(() => {
		if (invalid.value === true) {
			return true
		}
		if (valid.value === true) {
			return false
		}
		return undefined
	})

	// styles
	const { bemCssClasses } = useBemModifiers('vv-input-text', {
		modifiers: props.modifiers,
		valid,
		invalid,
		loading,
		disabled: props.disabled,
		readonly: props.readonly,
		iconLeft: hasIconLeft,
		iconRight: hasIconRight.value || !isEmpty(defaultRightIcon),
		floating: props.floating && !isEmpty(props.label),
		dirty: isDirty,
		focus: focused,
	})

	// attrs
	const hasAttrs = computed(() => {
		const type = (() => {
			if (isPassword.value && showPassword.value) {
				return INPUT_TYPES.TEXT
			}
			if (isDateTime.value && !isDirty.value && !focused.value) {
				return INPUT_TYPES.TEXT
			}
			return props.type
		})()
		const toReturn: InputHTMLAttributes = {
			type,
			name: props.name,
			tabindex: hasTabindex.value,
			disabled: props.disabled,
			readonly: props.readonly,
			required: props.required,
			autocomplete: props.autocomplete,
			'aria-invalid': isInvalid.value,
			'aria-describedby':
				!hasInvalid.value && hasHint.value
					? hasDescribedBy.value
					: undefined,
			'aria-errormessage': hasInvalid.value
				? hasDescribedBy.value
				: undefined,
		}
		if (
			type === INPUT_TYPES.DATE ||
			type === INPUT_TYPES.MONTH ||
			type === INPUT_TYPES.WEEK ||
			type === INPUT_TYPES.TIME ||
			type === INPUT_TYPES.DATETIME_LOCAL ||
			type === INPUT_TYPES.NUMBER
		) {
			toReturn.step = props.step
			toReturn.max = String(props.max)
			toReturn.min = String(props.min)
		}
		if (
			type === INPUT_TYPES.TEXT ||
			type === INPUT_TYPES.SEARCH ||
			type === INPUT_TYPES.URL ||
			type === INPUT_TYPES.TEL ||
			type === INPUT_TYPES.EMAIL ||
			type === INPUT_TYPES.PASSWORD ||
			type === INPUT_TYPES.NUMBER
		) {
			toReturn.placeholder = inputTextPlaceholder.value
		}
		if (
			type === INPUT_TYPES.TEXT ||
			type === INPUT_TYPES.SEARCH ||
			type === INPUT_TYPES.URL ||
			type === INPUT_TYPES.TEL ||
			type === INPUT_TYPES.EMAIL ||
			type === INPUT_TYPES.PASSWORD
		) {
			toReturn.minlength = props.minlength
			toReturn.maxlength = props.maxlength
			toReturn.pattern = props.pattern
		}
		if (type === INPUT_TYPES.EMAIL) {
			toReturn.multiple = props.multiple
		}
		return toReturn
	})

	// slots
	const slotProps = computed(() => ({
		valid: props.valid,
		invalid: props.invalid,
		modelValue: props.modelValue,
		togglePassword: onTogglePassword,
		stepUp: onStepUp,
		stepDown: onStepDown,
		clear: onClear,
	}))

	// components
	const { HintSlot, hasHint, hasInvalid } = HintSlotFactory(props, slots)
	const PasswordInputActions = VvInputTextActionsFactory(
		INPUT_TYPES.PASSWORD,
		props,
	)
	const NumberInputActions = VvInputTextActionsFactory(
		INPUT_TYPES.NUMBER,
		props,
	)
	const SearchInputActions = VvInputTextActionsFactory(
		INPUT_TYPES.SEARCH,
		props,
	)
</script>

<template>
	<div :class="bemCssClasses">
		<label v-if="label" :for="hasId" class="vv-input-text__label">
			{{ label }}
		</label>
		<div class="vv-input-text__wrapper">
			<!-- @slot Slot to replace left icon -->
			<slot name="before" v-bind="slotProps">
				<VvIcon
					v-if="hasIconLeft"
					class="vv-input-text__icon-left"
					v-bind="hasIcon"
				/>
			</slot>
			<input
				:id="hasId"
				ref="input"
				v-model="localModelValue"
				v-bind="hasAttrs"
				@keyup="emit('keyup', $event)"
			/>
			<!-- @slot Slot to replace right icon -->
			<slot name="after" v-bind="slotProps">
				<VvIcon
					v-if="hasIconRight || defaultRightIcon"
					v-bind="hasIconRight ? hasIcon : defaultRightIcon"
				/>
				<PasswordInputActions
					v-else-if="isPassword"
					@toggle-password="onTogglePassword"
				/>
				<NumberInputActions
					v-else-if="isNumber"
					@step-up="onStepUp"
					@step-down="onStepDown"
				/>
				<SearchInputActions v-else-if="isSearch" @clear="onClear" />
			</slot>
			<span v-if="count" class="vv-input-text__limit">
				<!-- @slot Slot to replace count -->
				<slot name="count" v-bind="slotProps">
					{{ countFormatted }}
				</slot>
			</span>
		</div>
		<HintSlot :id="hasDescribedBy" class="vv-input-text__hint" />
	</div>
</template>
