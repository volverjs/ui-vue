<script lang="ts">
export default {
	name: 'VvNativeSelect'
}
</script>

<script setup lang="ts">
import { computed, toRefs, useSlots, type InputHTMLAttributes } from 'vue'
import { nanoid } from 'nanoid'
import { isEmpty } from '@/utils/ObjectUtilities'
import VvIcon from '@/components/VvIcon/VvIcon.vue'
import HintSlotFactory from '@/components/common/HintSlot'
import { useBemModifiers } from '@/composables/useModifiers'
import {
	type Option,
	VvNativeSelectProps,
	VvNativeSelectEmits
} from '@/components/VvNativeSelect'

// props, emit and slots
const props = defineProps(VvNativeSelectProps)
const emit = defineEmits(VvNativeSelectEmits)
const slots = useSlots()

// hint
const { HintSlot, hasHint, hasErrors } = HintSlotFactory(props, slots)

// data
const {
	modifiers,
	disabled,
	readonly,
	loading,
	iconLeft,
	iconRight,
	error,
	valid
} = toRefs(props)

// computed
const hasId = computed(() => String(props.id || nanoid()))
const hasDescribedBy = computed(() => `${hasId.value}-hint`)

// dirty
const isDirty = computed(() => !isEmpty(props.modelValue))

// disabled
const isDisabled = computed(() => props.disabled || props.readonly)
const hasTabindex = computed(() => {
	return isDisabled.value ? -1 : props.tabindex
})

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

// styles
const { bemCssClasses } = useBemModifiers('vv-select', {
	modifiers,
	loading,
	readonly,
	iconLeft,
	iconRight,
	valid,
	invalid: error,
	dirty: isDirty
})

// attrs
const hasAttrs = computed(() => {
	return {
		name: props.name,
		tabindex: hasTabindex.value,
		'aria-invalid': isInvalid.value,
		'aria-describedby':
			!hasErrors.value && hasHint.value
				? hasDescribedBy.value
				: undefined,
		'aria-errormessage': hasErrors.value ? hasDescribedBy.value : undefined
	} as InputHTMLAttributes
})

/**
 * Retrieve the option value based on prop "valueKey" or the option if it is a string
 * @param {String | Option} option
 */
function getValue(option: string | Option) {
	return typeof option === 'string' ? option : option[props.valueKey]
}

/**
 * Retrieve the option label based on prop "labelKey" or the option if it is a string
 * @param {String | Option} option
 */
function getLabel(option: string | Option) {
	return typeof option === 'string' ? option : option[props.labelKey]
}

/**
 * Retrieve the disabled state of an option based on prop "disabled" or the disabled attribute
 * @param {String | Option} option
 */
function getDisabled(option: string | Option): boolean {
	if (typeof option === 'string' || option.disabled === undefined) {
		return disabled.value
	}
	return option.disabled
}

const localModelValue = computed({
	get: () => {
		return typeof props.modelValue === 'object'
			? (props.modelValue as Record<string, unknown>)?.[props.valueKey]
			: props.modelValue
	},
	set: (newValue) => {
		// find option object if useObject prop is true
		const valueObject = props.useObject
			? props.options?.find(
					(option) => (option as Option)[props.valueKey] === newValue
			  )
			: undefined
		// use valueObject if exist or the target value
		emit('update:modelValue', valueObject ?? newValue)
	}
})
</script>

<template>
	<div :class="bemCssClasses">
		<label v-if="label" :for="hasId">{{ label }}</label>
		<!-- #region native select -->
		<div class="vv-select__wrapper">
			<slot name="icon-left">
				<vv-icon v-if="iconLeft" :name="iconLeft" />
			</slot>
			<select
				:id="hasId"
				v-model="localModelValue"
				v-bind="hasAttrs"
				:disabled="isDisabled"
				:required="required">
				<option v-if="placeholder" :value="undefined" disabled>
					{{ placeholder }}
				</option>
				<option
					v-for="(option, index) in options"
					:key="index"
					:disabled="getDisabled(option)"
					:value="getValue(option)">
					{{ getLabel(option) }}
				</option>
			</select>
			<slot name="icon-right">
				<vv-icon v-if="iconRight" :name="iconRight" />
			</slot>
		</div>
		<!-- #endregion native select -->
		<HintSlot :id="hasDescribedBy" class="vv-select__hint" />
	</div>
</template>
