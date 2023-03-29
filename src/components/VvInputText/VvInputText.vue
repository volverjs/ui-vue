<script lang="ts">
	export default {
		name: 'VvInputText',
	}
</script>

<script setup lang="ts">
	import type { InputHTMLAttributes } from 'vue'
	import { Mask } from 'maska'
	import HintSlotFactory from '../common/HintSlot'
	import VvIcon from '../VvIcon/VvIcon.vue'
	import VvInputTextActionsFactory from '../VvInputText/VvInputTextActions'
	import {
		VvInputTextEvents,
		VvInputTextProps,
		INPUT_TYPES,
		TYPES_ICON,
	} from '../VvInputText'

	// props, emit, slots and attrs
	const props = defineProps(VvInputTextProps)
	const emit = defineEmits(VvInputTextEvents)
	const slots = useSlots()

	// template refs
	const inputEl = ref()
	const innerEl = ref()

	defineExpose({ $inner: innerEl })

	// data
	const {
		id,
		icon,
		iconPosition,
		label,
		modelValue,
		count,
		valid,
		invalid,
		loading,
	} = toRefs(props)
	const hasId = useUniqueId(id)
	const hasDescribedBy = computed(() => `${hasId.value}-hint`)
	// BUG: https://www.samanthaming.com/tidbits/88-css-placeholder-shown/
	const inputTextPlaceholder = computed(() =>
		props.floating && isEmpty(props.placeholder) ? ' ' : props.placeholder,
	)

	// debounce
	const localModelValue = useDebouncedInput(
		modelValue,
		emit,
		props.debounce,
		{
			getter: (value) => {
				if (mask.value) {
					return mask.value.masked(value ?? '')
				}
				return value
			},
			setter: (value) => {
				if (mask.value) {
					value = mask.value.unmasked(value)
				}
				if (props.type === INPUT_TYPES.NUMBER) {
					return Number(value)
				}
				return value
			},
		},
	)

	// focus
	const { focused } = useComponentFocus(inputEl, emit)
	const isFocused = computed(
		() => focused.value && !props.disabled && !props.readonly,
	)

	// visibility
	const isVisible = useElementVisibility(inputEl)
	watch(isVisible, (newValue) => {
		if (newValue && props.autofocus && !props.disabled && !props.readonly) {
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
			inputEl.value.stepUp()
			localModelValue.value = unref(inputEl).value
		}
	}
	const onStepDown = () => {
		if (isClickable.value) {
			inputEl.value.stepDown()
			localModelValue.value = unref(inputEl).value
		}
	}

	// search
	const isSearch = computed(() => props.type === INPUT_TYPES.SEARCH)
	const onClear = () => {
		localModelValue.value = undefined
	}

	// icons
	const { hasIcon, hasIconBefore, hasIconAfter } = useComponentIcon(
		icon,
		iconPosition,
	)
	const defaultAfterIcon = computed(() => {
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
		upperLimit: Number(props.maxlength),
		lowerLimit: Number(props.minlength),
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
	const { modifiers } = toRefs(props)
	const bemCssClasses = useModifiers(
		'vv-input-text',
		modifiers,
		computed(() => ({
			valid: valid.value,
			invalid: invalid.value,
			loading: loading.value,
			disabled: props.disabled,
			readonly: props.readonly,
			'icon-before': hasIconBefore.value,
			'icon-after': hasIconAfter.value || !isEmpty(defaultAfterIcon),
			floating: props.floating && !isEmpty(props.label),
			dirty: isDirty.value,
			focus: isFocused.value,
			'auto-width': props.autoWidth,
		})),
	)

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
			toReturn.max =
				props.max !== undefined ? String(props.max) : undefined
			toReturn.min =
				props.min !== undefined ? String(props.min) : undefined
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

	// mask
	const mask = ref()
	watch(
		[
			() => props.mask,
			() => props.type,
			() => props.maskEager,
			() => props.maskReversed,
			() => props.maskTokens,
			() => props.maskTokensReplace,
		],
		([newMask, newType, eager, reversed, tokens, tokensReplace]) => {
			if (newMask && newType === INPUT_TYPES.TEXT) {
				mask.value = new Mask({
					mask: newMask,
					eager,
					reversed,
					tokens,
					tokensReplace,
				})
				return
			}
			mask.value = undefined
		},
		{ immediate: true },
	)

	// auto-width
	const onClickInner = () => {
		if (isClickable.value) {
			focused.value = true
		}
	}
	const hasStyle = computed(() => {
		if (!props.autoWidth) {
			return undefined
		}
		return {
			width:
				localModelValue.value !== undefined
					? `${String(localModelValue.value).length + 1}ch`
					: undefined,
		}
	})
</script>

<template>
	<div :class="bemCssClasses">
		<label v-if="label" :for="hasId" class="vv-input-text__label">
			{{ label }}
		</label>
		<div class="vv-input-text__wrapper">
			<div v-if="$slots.before" class="vv-input-text__input-before">
				<!-- @slot Slot before input icon -->
				<slot name="before" v-bind="slotProps" />
			</div>
			<div
				ref="innerEl"
				class="vv-input-text__inner"
				@click.stop="onClickInner"
			>
				<VvIcon
					v-if="hasIconBefore"
					class="vv-input-text__icon"
					v-bind="hasIcon"
				/>
				<input
					:id="hasId"
					ref="inputEl"
					v-model="localModelValue"
					v-bind="hasAttrs"
					:style="hasStyle"
					@keyup="emit('keyup', $event)"
				/>
				<div
					v-if="(unit || $slots.unit) && isDirty"
					class="vv-input-text__unit"
				>
					<!-- @slot Slot to replace unit-->
					<slot name v-bind="slotProps">
						{{ unit }}
					</slot>
				</div>
			</div>
			<!-- @slot Slot to replace right icon -->
			<VvIcon
				v-if="hasIconAfter || defaultAfterIcon"
				class="vv-input-text__icon vv-input-text__icon-after"
				v-bind="hasIconAfter ? hasIcon : defaultAfterIcon"
			/>
			<PasswordInputActions
				v-else-if="isPassword && !hideActions && isClickable"
				@toggle-password="onTogglePassword"
			/>
			<NumberInputActions
				v-else-if="isNumber && !hideActions && isClickable"
				@step-up="onStepUp"
				@step-down="onStepDown"
			/>
			<SearchInputActions
				v-else-if="isSearch && !hideActions && isClickable"
				@clear="onClear"
			/>
			<!-- @slot Slot after input -->
			<div v-if="$slots.after" class="vv-input-text__input-after">
				<!-- @slot Slot before input icon -->
				<slot name="after" v-bind="slotProps" />
			</div>
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
