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
	type HTMLAttributes,
	type TextareaHTMLAttributes
} from 'vue'
import { nanoid } from 'nanoid'
import { isEmpty, pickBy } from '@/utils/ObjectUtilities'
import HintSlotFactory from '@/components/common/HintSlot'
import { useComponentIcon } from '@/composables/icons/useComponentIcons'
import { useComponentFocus } from '@/composables/focus/useComponentFocus'
import { useDebouncedInput } from '@/composables/debouncedInput/useDebouncedInput'
import { useTextLimit } from '@/composables/textLimit/useTextLimit'
import { toBem } from '@/composables/useModifiers'
import VvIcon from '@/components/VvIcon/VvIcon.vue'
import { VvTextareaProps, VvTextareaEvents } from '@/components/VvTextarea'

// props, emit, slots and attrs
const props = defineProps(VvTextareaProps)
const emit = defineEmits(VvTextareaEvents)
const slots = useSlots()
const attrs = useAttrs()

// template refs
const input = ref()

// data
const { icon, iconPosition, label, modelValue, autoclear, limit } =
	toRefs(props)
const textAreaId = (attrs.id as string) || nanoid()
const textAreaLabeledBy = `${textAreaId}-label`
const textAreaDescribedBy = `${textAreaId}-hint`
//BUG - https://www.samanthaming.com/tidbits/88-css-placeholder-shown/
const textAreaPlaceholder = computed(() =>
	props.floating && isEmpty(props.placeholder) ? ' ' : props.placeholder
)

// debounce
const inputTextData = useDebouncedInput(modelValue, emit, props.debounce)

// icons
const { hasIconLeft, hasIconRight } = useComponentIcon(icon, iconPosition, {
	iconLeft: slots['icon-left'],
	iconRight: slots['icon-right']
})

// focus
const { focused } = useComponentFocus(input, emit)

// text limit
const { textLength, formattedTextLimitLength } = useTextLimit(inputTextData, {
	mode: props.limit,
	upperLimit: props.maxlength || 0
})

// styles
const textAreaClass = computed(() => {
	return [
		toBem('vv-textarea', {
			modifiers: props.modifiers,
			readonly: props.readonly,
			valid: props.valid,
			invalid: props.error,
			loading: props.loading,
			iconLeft: hasIconLeft,
			iconRight: hasIconRight,
			floating: props.floating && !isEmpty(props.label),
			dirty: !isEmpty(modelValue),
			resizable: props.resizable
		}),
		attrs.class
	]
})
const textAreaProps = computed(() => {
	const dataAttrs = pickBy(attrs, (k: string) => k.startsWith('data-'))
	return {
		style: attrs.style,
		...dataAttrs
	} as HTMLAttributes
})
const htmlTextareaProps = computed(() => {
	const ariaAttrs = pickBy(attrs, (k: string) => k.startsWith('aria-'))

	return {
		id: textAreaId,
		placeholder: textAreaPlaceholder.value,
		name: props.name,
		autocomplete: props.autocomplete,
		disabled: props.disabled,
		readonly: props.readonly,
		minlength: props.minlength,
		maxlength: props.maxlength,
		cols: props.cols,
		rows: props.rows,
		required: props.required,
		tabindex: attrs.tabindex,
		'aria-invalid': props.error,
		'aria-valid': !props.valid,
		'aria-labeledby': textAreaLabeledBy,
		'aria-describedby': textAreaDescribedBy,
		'aria-errormessage': textAreaDescribedBy,
		...ariaAttrs
	} as TextareaHTMLAttributes
})

// slots props
const iconSlotProps = computed(() => {
	const { modelValue, valid, error, maxlength, hintLabel } = props
	return {
		valid,
		error,
		modelValue,
		hintLabel,
		maxlength,
		textLength
	}
})

// hint
const HintSlot = HintSlotFactory(props, slots)

// methods
function clearTextarea() {
	inputTextData.value = ''
}

// lifecycle
onMounted(() => {
	if (props.autofocus) focused.value = true
})
</script>

<template>
	<div v-bind="textAreaProps" :class="textAreaClass">
		<label v-if="label" :id="textAreaLabeledBy" :for="textAreaId">{{
			label
		}}</label>
		<div class="vv-textarea__wrapper">
			<!-- @slot icon-left to replace icon left -->
			<slot v-if="hasIconLeft" name="icon-left" v-bind="iconSlotProps">
				<vv-icon class="vv-textarea__icon-left" :name="icon" />
			</slot>
			<textarea
				ref="input"
				v-model="inputTextData"
				v-bind="htmlTextareaProps"
				@input="emit('input', $event)" />
			<!-- autoclear text button -->
			<button
				v-if="autoclear && textLength > 0"
				class="vv-button vv-button--ghost"
				@click="clearTextarea">
				<vv-icon name="clear-field" />
			</button>
			<!-- @slot icon-right to replace icon right -->
			<slot v-if="hasIconRight" name="icon-right" v-bind="iconSlotProps">
				<vv-icon :name="icon" />
			</slot>
			<span v-if="limit" class="vv-textarea__limit">
				<slot name="limit"> {{ formattedTextLimitLength }} </slot>
			</span>
		</div>
		<HintSlot :id="textAreaDescribedBy" class="vv-textarea__hint" />
	</div>
</template>
