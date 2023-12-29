<script lang="ts">
	export default {
		name: 'VvInputText',
	}
</script>

<script setup lang="ts">
	import type { InputHTMLAttributes } from 'vue'
	import { useIMask } from 'vue-imask'
	import HintSlotFactory from '../common/HintSlot'
	import VvIcon from '../VvIcon/VvIcon.vue'
	import { ACTION_ICONS } from '../VvIcon'
	import VvInputTextActionsFactory from '../VvInputText/VvInputTextActions'
	import {
		VvInputTextEvents,
		VvInputTextProps,
		INPUT_TYPES,
	} from '../VvInputText'

	// props, emit, slots and attrs
	const props = defineProps(VvInputTextProps)
	const emit = defineEmits(VvInputTextEvents)
	const slots = useSlots()

	// props merged with volver defaults (now only for labels)
	const propsDefaults = useDefaults<typeof VvInputTextProps>(
		'VvInputText',
		VvInputTextProps,
		props,
	)

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
		debounce,
		maxlength,
		minlength,
		type,
		iMask,
		step,
	} = toRefs(props)
	const hasId = useUniqueId(id)
	const hasHintId = computed(() => `${hasId.value}-hint`)
	// BUG: https://www.samanthaming.com/tidbits/88-css-placeholder-shown/
	const inputTextPlaceholder = computed(() =>
		props.floating && isEmpty(props.placeholder) ? ' ' : props.placeholder,
	)

	// template refs
	const maskReady = ref(false)
	const { el, mask, typed, masked, unmasked } = useIMask(
		computed(
			() =>
				iMask?.value ?? {
					mask: /./,
				},
		),
		{
			emit,
			onAccept: () => {
				if (!maskReady.value) {
					return
				}
				emit('update:masked', masked.value)
				if (type.value === INPUT_TYPES.NUMBER) {
					if (masked.value === '') {
						if (
							localModelValue.value === null ||
							localModelValue.value === undefined
						) {
							return
						}
						localModelValue.value = undefined
						return
					}
					if (typeof typed.value !== 'number') {
						localModelValue.value = Number(typed.value)
						return
					}
					localModelValue.value = typed.value
					return
				}
				if (type.value === INPUT_TYPES.DATE) {
					if (
						el.value instanceof HTMLInputElement &&
						el.value.type === 'date'
					) {
						localModelValue.value = el.value.value
						return
					}
					let date = typed.value
					if (date === null || date === '') {
						if (!localModelValue.value) {
							return
						}
						localModelValue.value = ''
						return
					}
					if (!(date instanceof Date)) {
						date = new Date(date)
					}
					localModelValue.value = `${date.getFullYear()}-${(
						'0' +
						(date.getMonth() + 1)
					).slice(-2)}-${('0' + date.getDate()).slice(-2)}`
					return
				}
				if (type.value === INPUT_TYPES.DATETIME_LOCAL) {
					if (
						el.value instanceof HTMLInputElement &&
						el.value.type === 'datetime-local'
					) {
						localModelValue.value = el.value.value
						return
					}
					let date = typed.value
					if (date === null || date === '') {
						if (!localModelValue.value) {
							return
						}
						localModelValue.value = ''
						return
					}
					if (!(typed.value instanceof Date)) {
						date = new Date(date)
					}
					localModelValue.value = `${date.getFullYear()}-${(
						'0' +
						(date.getMonth() + 1)
					).slice(-2)}-${('0' + date.getDate()).slice(-2)}T${(
						'0' + date.getHours()
					).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`
					return
				}
				if (!localModelValue.value && !unmasked.value) {
					return
				}
				localModelValue.value = unmasked.value
			},
		},
	)
	onMounted(() => {
		if (mask.value) {
			maskReady.value = true
			typed.value = localModelValue.value ?? ''
		}
	})
	watch(
		() => props.modelValue,
		(newValue) => {
			if (mask.value) {
				typed.value =
					newValue && iMask?.value?.mask === Date
						? new Date(newValue)
						: newValue ?? ''
			}
		},
	)
	watch(
		() => props.masked,
		(newValue) => {
			masked.value = newValue ?? ''
		},
	)
	const inputEl = el as Ref<HTMLInputElement>
	const innerEl = ref()

	defineExpose({ $inner: innerEl })

	// debounce
	const localModelValue = useDebouncedInput(
		modelValue,
		emit,
		debounce?.value ?? 0,
	)

	// focus
	const { focused } = useComponentFocus(inputEl, emit)
	const isFocused = computed(
		() => focused.value && !props.disabled && !props.readonly,
	)
	watch(isFocused, (newValue) => {
		if (newValue && propsDefaults.value.selectOnFocus && inputEl.value) {
			inputEl.value.select()
		}
	})

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
			if (iMask?.value) {
				typed.value = typed.value + Number(step?.value ?? 1)
				return
			}
			inputEl.value.stepUp()
			localModelValue.value = Number(unref(inputEl).value)
		}
	}
	const onStepDown = () => {
		if (isClickable.value) {
			if (iMask?.value) {
				typed.value = typed.value - Number(step?.value ?? 1)

				return
			}
			inputEl.value.stepDown()
			localModelValue.value = Number(unref(inputEl).value)
		}
	}

	// search
	const isSearch = computed(() => props.type === INPUT_TYPES.SEARCH)
	const onClear = () => {
		localModelValue.value = ''
	}

	// icons
	const { hasIconBefore, hasIconAfter } = useComponentIcon(icon, iconPosition)
	const iconAfter = computed(() => {
		if (hasIconAfter.value !== undefined) {
			return hasIconAfter.value
		}
		switch (props.type) {
			case INPUT_TYPES.COLOR:
				return { name: ACTION_ICONS.showColorPicker }
			case INPUT_TYPES.DATE:
			case INPUT_TYPES.DATETIME_LOCAL:
			case INPUT_TYPES.WEEK:
			case INPUT_TYPES.MONTH:
				return { name: ACTION_ICONS.showDatePicker }
			case INPUT_TYPES.TIME:
				return { name: ACTION_ICONS.showTimePicker }
		}
		return undefined
	})

	// count
	const { formatted: countFormatted } = useTextCount(localModelValue, {
		mode: count.value,
		upperLimit: Number(maxlength?.value),
		lowerLimit: Number(minlength?.value),
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
			'icon-before': !!hasIconBefore.value,
			'icon-after': !!iconAfter.value,
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
			if (iMask?.value) {
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
			'aria-describedby': hasHintLabelOrSlot.value
				? hasHintId.value
				: undefined,
			'aria-errormessage': hasInvalidLabelOrSlot.value
				? hasHintId.value
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
	const {
		HintSlot,
		hasHintLabelOrSlot,
		hasInvalidLabelOrSlot,
		hintSlotScope,
	} = HintSlotFactory(propsDefaults, slots)
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

	// keydown
	const onKeyDown = (event: KeyboardEvent) => {
		switch (event.code) {
			case 'ArrowUp':
				if (isNumber.value) {
					onStepUp()
					event.preventDefault()
				}
				break

			case 'ArrowDown':
				if (isNumber.value) {
					onStepDown()
					event.preventDefault()
				}
				break
		}
		emit('keydown', event)
	}
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
					v-bind="hasIconBefore"
					class="vv-input-text__icon"
				/>
				<input
					:id="hasId"
					ref="inputEl"
					v-bind="hasAttrs"
					:style="hasStyle"
					@keyup="emit('keyup', $event)"
					@keydown="onKeyDown"
					@keypress="emit('keypress', $event)"
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
				v-if="iconAfter"
				v-bind="iconAfter"
				class="vv-input-text__icon vv-input-text__icon-after"
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
		<HintSlot :id="hasHintId" class="vv-input-text__hint">
			<template v-if="$slots.hint" #hint>
				<slot name="hint" v-bind="hintSlotScope" />
			</template>
			<template v-if="$slots.loading" #loading>
				<slot name="loading" v-bind="hintSlotScope" />
			</template>
			<template v-if="$slots.valid" #valid>
				<slot name="valid" v-bind="hintSlotScope" />
			</template>
			<template v-if="$slots.invalid" #invalid>
				<slot name="invalid" v-bind="hintSlotScope" />
			</template>
		</HintSlot>
	</div>
</template>
