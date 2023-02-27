<script lang="ts">
	export default {
		name: 'VvRadio',
	}
</script>

<script setup lang="ts">
	import { VvRadioProps, VvRadioEvents, useGroupProps } from '.'
	import { HintSlotFactory } from '../common/HintSlot'

	// props, emit and slots
	const props = defineProps(VvRadioProps)
	const emit = defineEmits(VvRadioEvents)
	const slots = useSlots()

	// data
	const { id, disabled, readonly, modelValue, valid, invalid } =
		useGroupProps(props, emit)
	const hasId = useUniqueId(id)
	const tabindex = computed(() => (isDisabled.value ? -1 : props.tabindex))

	// template refs
	const input = ref()

	// computed
	const isDisabled = computed(() => disabled.value || readonly.value)
	const isInvalid = computed(() => {
		if (invalid.value === true) {
			return true
		}
		if (valid.value === true) {
			return false
		}
		return undefined
	})
	const isChecked = computed(() =>
		Array.isArray(modelValue.value)
			? contains(props.value, modelValue.value)
			: equals(props.value, modelValue.value),
	)
	const hasValue = computed(() =>
		['string', 'number', 'boolean'].includes(typeof props.value)
			? props.value
			: true,
	)
	const localModelValue = computed({
		get() {
			return isChecked.value ? hasValue.value : null
		},
		set(newValue) {
			if (Array.isArray(modelValue.value)) {
				modelValue.value = [props.value]
			} else {
				modelValue.value = props.value
			}
			emit('change', newValue)
		},
	})

	// styles
	const { modifiers } = toRefs(props)
	const bemCssClasses = useModifiers(
		'vv-radio',
		modifiers,
		computed(() => ({
			valid: valid.value,
			invalid: invalid.value,
			disabled: disabled.value,
			readonly: readonly.value,
		})),
	)

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
			:tabindex="tabindex"
			:aria-invalid="isInvalid"
		/>
		<slot :value="modelValue">
			{{ label }}
		</slot>
		<HintSlot class="vv-radio__hint" :params="{ value: modelValue }" />
	</label>
</template>
