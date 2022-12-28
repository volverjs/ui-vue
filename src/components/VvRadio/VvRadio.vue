<script lang="ts">
export default {
	name: 'VvRadio'
}
</script>

<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import { contains, equals, removeFromList } from '@/utils/ObjectUtilities'
import { useBemModifiers } from '@/composables/useModifiers'
import {
	VvRadioProps,
	VvRadioEvents,
	useGroupProps
} from '@/components/VvRadio'
import { HintSlotFactory } from '@/components/common/HintSlot'

// props, emit and slots
const props = defineProps(VvRadioProps)
const emit = defineEmits(VvRadioEvents)
const slots = useSlots()

// data
const { disabled, readonly, modelValue, valid, error } = useGroupProps(
	props,
	emit
)

// template refs
const input = ref()

// computed
const hasId = computed(() =>
	props.id !== undefined ? String(props.id) : undefined
)
const isDisabled = computed(() => disabled.value || readonly.value)
const hasTabindex = computed(() => (isDisabled.value ? -1 : props.tabindex))
const isInvalid = computed(() => {
	if (props.error === true) {
		return true
	}
	if (props.valid === true) {
		return false
	}
	return undefined
})
const isChecked = computed(() =>
	Array.isArray(modelValue.value)
		? contains(props.value, modelValue.value)
		: equals(props.value, modelValue.value)
)
const hasValue = computed(() =>
	['string', 'number', 'boolean'].includes(typeof props.value)
		? props.value
		: true
)
const localModelValue = computed({
	get() {
		return isChecked.value ? hasValue.value : null
	},
	set(newValue) {
		if (Array.isArray(modelValue.value)) {
			modelValue.value = newValue
				? [...modelValue.value, props.value]
				: removeFromList(props.value, modelValue.value)
			return
		}
		modelValue.value = props.value
		emit('change', newValue)
	}
})

// styles
const { bemCssClasses } = useBemModifiers('vv-radio', {
	valid,
	invalid: error,
	disabled,
	readonly
})

// hint
const { HintSlot } = HintSlotFactory(props, slots)
</script>

<template>
	<label :class="bemCssClasses" :for="hasId">
		<input
			:id="hasId"
			ref="input"
			v-model="localModelValue"
			type="radio"
			class="vv-radio__input"
			:name="name"
			:disabled="isDisabled"
			:value="hasValue"
			:tabindex="hasTabindex"
			:aria-invalid="isInvalid" />
		<slot :value="modelValue">
			{{ label }}
		</slot>
		<HintSlot class="vv-radio__hint" :params="{ value: modelValue }" />
	</label>
</template>
