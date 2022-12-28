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
	type TextareaHTMLAttributes
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
import { VvTextareaProps, VvTextareaEvents } from '@/components/VvTextarea'

// props, emit, slots and attrs
const props = defineProps(VvTextareaProps)
const emit = defineEmits(VvTextareaEvents)
const slots = useSlots()

// template refs
const input = ref()

// data
const { icon, iconPosition, label, modelValue, autoclear, limit } =
	toRefs(props)
const hasId = computed(() => String(props.id || nanoid()))
const hasDescribedBy = computed(() => `${hasId.value}-hint`)
//BUG - https://www.samanthaming.com/tidbits/88-css-placeholder-shown/
const hasPlaceholder = computed(() =>
	props.floating && isEmpty(props.placeholder) ? ' ' : props.placeholder
)

// debounce
const localModelValue = useDebouncedInput(modelValue, emit, props.debounce)

// icons
const { hasIconLeft, hasIconRight } = useComponentIcon(icon, iconPosition, {
	iconLeft: slots['icon-left'],
	iconRight: slots['icon-right']
})

// focus
const { focused } = useComponentFocus(input, emit)

// text limit
const { textLength, formattedTextLimitLength } = useTextLimit(localModelValue, {
	mode: props.limit,
	upperLimit: props.maxlength || 0
})

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

// hint
const { HintSlot, hasHint, hasErrors } = HintSlotFactory(props, slots)

// styles
const { bemCssClasses } = useBemModifiers('vv-textarea', {
	modifiers: props.modifiers,
	readonly: props.readonly,
	valid: props.valid,
	invalid: props.error,
	loading: props.loading,
	iconLeft: hasIconLeft,
	iconRight: hasIconRight,
	floating: props.floating && !isEmpty(props.label),
	dirty: isDirty,
	resizable: props.resizable
})

// attrs
const hasAttrs = computed(
	() =>
		({
			placeholder: hasPlaceholder.value,
			name: props.name,
			autocomplete: props.autocomplete,
			minlength: props.minlength,
			maxlength: props.maxlength,
			cols: props.cols,
			rows: props.rows,
			'aria-invalid': isInvalid.value,
			'aria-describedby':
				!hasErrors.value && hasHint.value
					? hasDescribedBy.value
					: undefined,
			'aria-errormessage': hasErrors.value
				? hasDescribedBy.value
				: undefined
		} as TextareaHTMLAttributes)
)

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

// methods
function clearTextarea() {
	localModelValue.value = ''
}

// lifecycle
onMounted(() => {
	if (props.autofocus) {
		focused.value = true
	}
})
</script>

<template>
	<div v-bind="hasAttrs" :class="bemCssClasses">
		<label v-if="label" :for="hasId" class="vv-textarea__label">
			{{ label }}
		</label>
		<div class="vv-textarea__wrapper">
			<!-- @slot icon-left to replace icon left -->
			<slot v-if="hasIconLeft" name="icon-left" v-bind="iconSlotProps">
				<vv-icon class="vv-textarea__icon-left" :name="icon" />
			</slot>
			<textarea
				:id="hasId"
				ref="input"
				v-model="localModelValue"
				v-bind="hasAttrs"
				:disabled="disabled"
				:readonly="readonly"
				:required="required" />
			<!-- autoclear text button -->
			<button
				v-show="autoclear && textLength > 0"
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
		<HintSlot :id="hasDescribedBy" class="vv-textarea__hint" />
	</div>
</template>
