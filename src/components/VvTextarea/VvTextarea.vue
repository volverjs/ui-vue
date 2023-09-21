<script lang="ts">
	export default {
		name: 'VvTextarea',
	}
</script>

<script setup lang="ts">
	import type { TextareaHTMLAttributes } from 'vue'
	import HintSlotFactory from '../common/HintSlot'
	import VvIcon from '../VvIcon/VvIcon.vue'
	import { VvTextareaProps, VvTextareaEvents } from '.'

	// props, emit and slots
	const props = defineProps(VvTextareaProps)
	const emit = defineEmits(VvTextareaEvents)
	const slots = useSlots()

	// props merged with volver defaults (now only for labels)
	const propsDefaults = useDefaults<typeof VvTextareaProps>(
		'VvTextarea',
		VvTextareaProps,
		props,
	)

	// template refs
	const textarea = ref()

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
		modifiers,
		debounce,
		minlength,
		maxlength,
	} = toRefs(props)
	const hasId = useUniqueId(id)
	const hasHintId = computed(() => `${hasId.value}-hint`)
	// BUG - https://www.samanthaming.com/tidbits/88-css-placeholder-shown/
	const hasPlaceholder = computed(() =>
		props.floating && isEmpty(props.placeholder) ? ' ' : props.placeholder,
	)

	// debounce
	const localModelValue = useDebouncedInput(modelValue, emit, debounce?.value)

	// icons
	const { hasIcon, hasIconBefore, hasIconAfter } = useComponentIcon(
		icon,
		iconPosition,
	)

	// focus
	const { focused } = useComponentFocus(textarea, emit)

	// visibility
	const isVisible = useElementVisibility(textarea)
	watch(isVisible, (newValue) => {
		if (newValue && props.autofocus) {
			focused.value = true
		}
	})

	// count
	const { formatted: countFormatted } = useTextCount(localModelValue, {
		mode: count?.value,
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
		if (props.invalid === true) {
			return true
		}
		if (props.valid === true) {
			return false
		}
		return undefined
	})

	// hint
	const {
		HintSlot,
		hasHintLabelOrSlot,
		hasInvalidLabelOrSlot,
		hintSlotScope,
	} = HintSlotFactory(propsDefaults, slots)

	// styles
	const bemCssClasses = useModifiers(
		'vv-textarea',
		modifiers,
		computed(() => ({
			valid: valid.value,
			invalid: invalid.value,
			loading: loading.value,
			disabled: props.disabled,
			readonly: props.readonly,
			'icon-before': hasIconBefore.value,
			'icon-after': hasIconAfter.value,
			floating: props.floating && !isEmpty(props.label),
			dirty: isDirty.value,
			focus: focused.value,
			resizable: props.resizable,
		})),
	)

	// attrs
	const hasAttrs = computed(
		() =>
			({
				name: props.name,
				placeholder: hasPlaceholder.value,
				tabindex: hasTabindex.value,
				disabled: props.disabled,
				readonly: props.readonly,
				required: props.required,
				autocomplete: props.autocomplete,
				minlength: props.minlength,
				maxlength: props.maxlength,
				cols: props.cols,
				rows: props.rows,
				wrap: props.wrap,
				spellcheck: props.spellcheck,
				'aria-invalid': isInvalid.value,
				'aria-describedby': hasHintLabelOrSlot.value
					? hasHintId.value
					: undefined,
				'aria-errormessage': hasInvalidLabelOrSlot.value
					? hasHintId.value
					: undefined,
			}) as TextareaHTMLAttributes,
	)

	// slots props
	const slotProps = computed(() => ({
		valid: props.valid,
		invalid: props.invalid,
		modelValue: props.modelValue,
		hintLabel: props.hintLabel,
		maxlength: props.maxlength,
		minlength: props.minlength,
		clear: onClear,
	}))

	// methods
	const onClear = () => {
		localModelValue.value = undefined
	}
</script>

<template>
	<div :class="bemCssClasses">
		<label v-if="label" :for="hasId" class="vv-textarea__label">
			{{ label }}
		</label>
		<div class="vv-textarea__wrapper">
			<!-- @slot Slot to replace icon before textarea -->
			<div v-if="$slots.before" class="vv-textarea__input-before">
				<!-- @slot Slot before input -->
				<slot name="before" v-bind="slotProps" />
			</div>
			<div class="vv-textarea__inner">
				<VvIcon
					v-if="hasIconBefore"
					class="vv-textarea__icon"
					v-bind="hasIcon"
				/>
				<textarea
					:id="hasId"
					ref="textarea"
					v-model="localModelValue"
					v-bind="hasAttrs"
					@keyup="emit('keyup', $event)"
				/>
				<VvIcon
					v-if="hasIconAfter"
					class="vv-textarea__icon vv-textarea__icon-after"
					v-bind="hasIcon"
				/>
			</div>
			<div v-if="$slots.after" class="vv-textarea__input-after">
				<!-- @slot Slot after input -->
				<slot name="after" v-bind="slotProps" />
			</div>
			<span v-if="count" class="vv-textarea__limit">
				<!-- @slot Slot to replace count -->
				<slot name="count" v-bind="slotProps">
					{{ countFormatted }}
				</slot>
			</span>
		</div>
		<HintSlot :id="hasHintId" class="vv-textarea__hint">
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
