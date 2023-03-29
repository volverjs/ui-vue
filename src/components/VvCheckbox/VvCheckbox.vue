<script lang="ts">
	export default {
		name: 'VvCheckbox',
	}
</script>

<script setup lang="ts">
	import { VvCheckboxProps, VvCheckboxEvents, useGroupProps } from '.'
	import { HintSlotFactory } from '../common/HintSlot'

	// props, emits and slots
	const props = defineProps(VvCheckboxProps)
	const emit = defineEmits(VvCheckboxEvents)
	const slots = useSlots()

	// data
	const {
		id,
		disabled,
		readonly,
		valid,
		invalid,
		propsSwitch,
		modelValue,
		indeterminate,
		isInGroup,
	} = useGroupProps(props, emit)
	const hasId = useUniqueId(id)
	const tabindex = computed(() => (isDisabled.value ? -1 : props.tabindex))

	// template ref
	const input = ref()

	// computed
	const isBinary = computed(
		() => props.uncheckedValue !== undefined && !isInGroup.value,
	)
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
	const isChecked = computed(() => {
		if (isBinary.value) {
			return modelValue.value === props.value
		}
		return Array.isArray(modelValue.value)
			? contains(props.value, modelValue.value)
			: equals(props.value, modelValue.value)
	})
	const isIndeterminated = computed(() => {
		if (indeterminate.value) {
			return true
		}
		if (
			!isChecked.value &&
			isBinary.value &&
			props.uncheckedValue !== modelValue.value
		) {
			return true
		}
		return false
	})
	const hasValue = computed(() => {
		if (isBinary.value) {
			return undefined
		}
		return ['string', 'number', 'boolean'].includes(typeof props.value)
			? props.value
			: true
	})
	const localModelValue = computed({
		get() {
			return isChecked.value
		},
		set(newValue) {
			if (isBinary.value) {
				modelValue.value = newValue ? props.value : props.uncheckedValue
			} else if (Array.isArray(modelValue.value) || isInGroup.value) {
				const toReturn = new Set(
					Array.isArray(modelValue.value)
						? modelValue.value
						: modelValue.value !== undefined
						? [modelValue.value]
						: [],
				)
				if (newValue) {
					toReturn.add(props.value)
				} else {
					toReturn.delete(props.value)
				}
				modelValue.value = [...toReturn]
			} else {
				modelValue.value = newValue ? props.value : undefined
			}
			emit('change', newValue)
		},
	})

	// styles
	const { modifiers } = toRefs(props)
	const bemCssClasses = useModifiers(
		'vv-checkbox',
		modifiers,
		computed(() => ({
			switch: propsSwitch.value,
			valid: valid.value,
			invalid: invalid.value,
			disabled: disabled.value,
			readonly: readonly.value,
			indeterminate: indeterminate.value,
		})),
	)

	watchEffect(() => {
		if (isBinary.value && Array.isArray(modelValue.value)) {
			// eslint-disable-next-line no-console
			console.warn(
				`[VvCheckbox] The model value is an array but the component is in binary mode.`,
			)
		}
	})

	// indeterminate
	watch(
		() => isIndeterminated.value,
		(newValue) => {
			if (newValue) {
				input.value.indeterminate = true
			} else {
				input.value.indeterminate = false
			}
		},
	)
	onMounted(() => {
		if (isIndeterminated.value) {
			input.value.indeterminate = true
		}
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
			type="checkbox"
			class="vv-checkbox__input"
			:name="name"
			:disabled="isDisabled"
			:value="hasValue"
			:tabindex="tabindex"
			:aria-invalid="isInvalid"
		/>
		<!-- @slot Use this slot for check label -->
		<slot :value="modelValue">
			{{ label }}
		</slot>
		<HintSlot class="vv-checkbox__hint" :params="{ value: modelValue }" />
	</label>
</template>
