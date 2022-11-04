<template>
	<div v-bind="vvTextareaProps" :class="vvInputTextareaClass">
		<label v-if="label" :for="innerTextareaProps.id">{{ label }}</label>
		<div class="vv-textarea__wrapper">
			<!-- @slot icon-left to replace icon left -->
			<slot v-if="hasIconLeft" name="icon-left" v-bind="iconSlotProps">
				<vv-icon class="vv-textarea__icon-left" :name="icon" />
			</slot>
			<textarea
				ref="input"
				v-bind="innerTextareaProps"
				v-model="inputTextData"
				@input="emit('input', $event)" />
			<!-- @slot icon-right to replace icon right -->
			<slot v-if="hasIconRight" name="icon-right" v-bind="iconSlotProps">
				<!-- default password icon -->
				<vv-icon :name="icon" />
			</slot>
		</div>
		<HintSlot
			:id="inputAriaAttrs['aria-describedby']"
			class="vv-textarea__hint" />
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
import { refDebounced } from '@vueuse/core'
import { useComponentIcons } from '../../composables/icons/useComponentIcons'
import { useComponentFocus } from '../../composables/focus/useComponentFocus'
import { useBemModifiers } from '@/composables/useModifiers'

//Props, Emits, Slots e Attrs
const props = defineProps(VvTextareaProps)
const emit = defineEmits(VvTextareaEvents)
const slots = useSlots()
const attrs = useAttrs()

//Template References
const input = ref()

//Data
const inputTextData = ref(props.modelValue)
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

//Debounce
const debouncedInputTextData = refDebounced(inputTextData, props.debounce || 0)
watch(debouncedInputTextData, (v) => emit('update:modelValue', v))

//Gestione ICONE
const iconProps = { icon, iconPosition }
const iconSlots = {
	iconLeft: slots['icon-left'],
	iconRight: slots['icon-right']
}
const { hasIconLeft, hasIconRight } = useComponentIcons(iconProps, iconSlots)

//Input FOCUS
const { focused } = useComponentFocus(input, emit)

//Styles & Bindings
const { bemCssClasses: bemInputClass } = useBemModifiers('vv-textarea', {
	readonly,
	valid,
	invalid: error,
	loading,
	iconLeft: hasIconLeft,
	iconRight: hasIconRight,
	floating: computed(
		() => floating.value && ObjectUtilities.isNotEmpty(label?.value)
	),
	dirty: computed(() => ObjectUtilities.isNotEmpty(modelValue))
})
const vvInputTextareaClass = computed(() => {
	const { class: cssClass } = attrs
	return {
		class: cssClass,
		...bemInputClass.value
	}
})
const vvTextareaProps = computed(() => {
	const { style } = attrs
	const dataAttrs = ObjectUtilities.pickBy(attrs, (k: string) =>
		k.startsWith('data-')
	)
	return {
		style,
		...dataAttrs
	} as HTMLAttributes
})
const innerTextareaProps = computed(() => {
	const {
		id,
		name,
		autocomplete,
		minlength,
		maxlength,
		disabled,
		readonly,
		floating,
		placeholder,
		cols,
		rows
	} = props

	const _id = id || name
	//BUG - https://www.samanthaming.com/tidbits/88-css-placeholder-shown/
	const _placeholder =
		floating && ObjectUtilities.isEmpty(placeholder) ? ' ' : placeholder

	return {
		id: _id,
		placeholder: _placeholder,
		name,
		autocomplete,
		disabled,
		readonly,
		minlength,
		maxlength,
		cols,
		rows,
		...inputAriaAttrs.value
	} as TextareaHTMLAttributes
})
const inputAriaAttrs = computed(() => {
	const { name } = attrs
	const ariaAttrs = ObjectUtilities.pickBy(attrs, (k: string) =>
		k.startsWith('aria-')
	)
	return {
		'aria-label': name,
		'aria-describedby': `${name}-hint`,
		'aria-invalid': props.error,
		...ariaAttrs
	}
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
