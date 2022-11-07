<template>
	<div v-bind="textAreaProps" :class="textAreaClass">
		<label v-if="label" :for="textAreaId">{{ label }}</label>
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
			<!-- @slot icon-right to replace icon right -->
			<slot v-if="hasIconRight" name="icon-right" v-bind="iconSlotProps">
				<!-- default password icon -->
				<vv-icon :name="icon" />
			</slot>
		</div>
		<HintSlot :id="textAreaDescribedBy" class="vv-textarea__hint" />
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
	type TextareaHTMLAttributes
} from 'vue'
import ObjectUtilities from '../../utils/ObjectUtilities'
import { VvTextareaProps, VvTextareaEvents } from './VvTextarea'

//Componenti
import VvIcon from '../../components/VvIcon/VvIcon.vue'
import HintSlotFactory from '../common/HintSlot'

//Composables
import { useComponentIcon } from '../../composables/icons/useComponentIcons'
import { useComponentFocus } from '../../composables/focus/useComponentFocus'
import { useDebouncedInput } from '../../composables/debouncedInput/useDebouncedInput'
import { toBem } from '@/composables/useModifiers'

//Props, Emits, Slots e Attrs
const props = defineProps(VvTextareaProps)
const emit = defineEmits(VvTextareaEvents)
const slots = useSlots()
const attrs = useAttrs()

//Template References
const input = ref()

//Data
const {
	readonly,
	icon,
	iconPosition,
	valid,
	error,
	loading,
	floating,
	label,
	modelValue
} = toRefs(props)
const textAreaId = props.id || props.name
const textAreaDescribedBy = `${props.name}-hint`
//BUG - https://www.samanthaming.com/tidbits/88-css-placeholder-shown/
const textAreaPlaceholder = computed(() =>
	props.floating && ObjectUtilities.isEmpty(props.placeholder)
		? ' '
		: props.placeholder
)

//Debounce input
const inputTextData = useDebouncedInput(modelValue, props.debounce, emit)

//Gestione ICONE
const { hasIconLeft, hasIconRight } = useComponentIcon(icon, iconPosition, {
	iconLeft: slots['icon-left'],
	iconRight: slots['icon-right']
})

//Input FOCUS
const { focused } = useComponentFocus(input, emit)

//Styles & Bindings
const textAreaClass = computed(() => {
	return [
		toBem('vv-textarea', {
			readonly,
			valid,
			invalid: error,
			loading,
			iconLeft: hasIconLeft,
			iconRight: hasIconRight,
			floating:
				floating.value && ObjectUtilities.isNotEmpty(label?.value),
			dirty: ObjectUtilities.isNotEmpty(modelValue)
		}),
		attrs.class
	]
})
const textAreaProps = computed(() => {
	const dataAttrs = ObjectUtilities.pickBy(attrs, (k: string) =>
		k.startsWith('data-')
	)
	return {
		style: attrs.style,
		...dataAttrs
	} as HTMLAttributes
})
const htmlTextareaProps = computed(() => {
	const ariaAttrs = ObjectUtilities.pickBy(attrs, (k: string) =>
		k.startsWith('aria-')
	)

	return {
		id: props.id,
		placeholder: textAreaPlaceholder.value,
		name: props.name,
		autocomplete: props.autocomplete,
		disabled: props.disabled,
		readonly: props.readonly,
		minlength: props.minlength,
		maxlength: props.maxlength,
		cols: props.cols,
		rows: props.rows,
		'aria-label': props.label || props.name,
		'aria-describedby': textAreaDescribedBy,
		'aria-invalid': props.error,
		...ariaAttrs
	} as TextareaHTMLAttributes
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

//methods
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
