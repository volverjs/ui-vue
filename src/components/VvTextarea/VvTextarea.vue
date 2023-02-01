<script lang="ts">
	export default {
		name: 'VvTextarea',
	}
</script>

<script setup lang="ts">
	import type { TextareaHTMLAttributes } from 'vue'
	import HintSlotFactory from '@/components/common/HintSlot'
	import VvIcon from '@/components/VvIcon/VvIcon.vue'
	import { VvTextareaProps, VvTextareaEvents } from '@/components/VvTextarea'

	// props, emit and slots
	const props = defineProps(VvTextareaProps)
	const emit = defineEmits(VvTextareaEvents)
	const slots = useSlots()

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
	} = toRefs(props)
	const hasId = useUniqueId(id)
	const hasDescribedBy = computed(() => `${hasId.value}-hint`)
	// BUG - https://www.samanthaming.com/tidbits/88-css-placeholder-shown/
	const hasPlaceholder = computed(() =>
		props.floating && isEmpty(props.placeholder) ? ' ' : props.placeholder,
	)

	// debounce
	const localModelValue = useDebouncedInput(modelValue, emit, props.debounce)

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
		if (props.invalid === true) {
			return true
		}
		if (props.valid === true) {
			return false
		}
		return undefined
	})

	// hint
	const { HintSlot, hasHint, hasInvalid } = HintSlotFactory(props, slots)

	// styles
	const bemCssClasses = useBemModifiers(
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
			focused: focused.value,
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
				'aria-describedby':
					!hasInvalid.value && hasHint.value
						? hasDescribedBy.value
						: undefined,
				'aria-errormessage': hasInvalid.value
					? hasDescribedBy.value
					: undefined,
			} as TextareaHTMLAttributes),
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
		<HintSlot :id="hasDescribedBy" class="vv-textarea__hint" />
	</div>
</template>
