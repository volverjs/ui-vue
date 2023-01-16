<script lang="ts">
export default {
	name: 'VvSelect'
}
</script>

<script setup lang="ts">
import type { Option } from '@/types/generic'
import { computed, toRefs, useSlots, ref, type SelectHTMLAttributes } from 'vue'
import { nanoid } from 'nanoid'
import { isEmpty } from '@/utils/ObjectUtilities'
import VvIcon from '@/components/VvIcon/VvIcon.vue'
import HintSlotFactory from '@/components/common/HintSlot'
import { useBemModifiers } from '@/composables/useModifiers'
import { VvSelectProps, VvSelectEmits } from '@/components/VvSelect'
import { useComponentIcon } from '@/composables/icons/useComponentIcons'
import { useOptions } from '@/composables/options/useOptions'
import { useComponentFocus } from '@/composables/focus/useComponentFocus'

// props, emit and slots
const props = defineProps(VvSelectProps)
const emit = defineEmits(VvSelectEmits)
const slots = useSlots()

// template refs
const select = ref()

// hint
const { HintSlot, hasHint, hasInvalid } = HintSlotFactory(props, slots)

// data
const {
	modifiers,
	disabled,
	readonly,
	loading,
	icon,
	iconPosition,
	invalid,
	valid
} = toRefs(props)

// computed
const hasId = computed(() => String(props.id || nanoid()))
const hasDescribedBy = computed(() => `${hasId.value}-hint`)

// focus
const { focused } = useComponentFocus(select, emit)

// icons
const { hasIcon, hasIconLeft, hasIconRight } = useComponentIcon(
	icon,
	iconPosition
)

// dirty
const isDirty = computed(() => !isEmpty(props.modelValue))

// disabled
const isDisabled = computed(() => props.disabled || props.readonly)
const hasTabindex = computed(() => {
	return isDisabled.value ? -1 : props.tabindex
})

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

// styles
const { bemCssClasses } = useBemModifiers('vv-select', {
	modifiers,
	valid,
	invalid,
	loading,
	disabled,
	readonly,
	iconLeft: hasIconLeft,
	iconRight: hasIconRight,
	dirty: isDirty,
	focus: focused
})

// attrs
const hasAttrs: SelectHTMLAttributes = computed(() => {
	return {
		name: props.name,
		tabindex: hasTabindex.value,
		disabled: isDisabled.value,
		required: props.required,
		size: props.size,
		autocomplete: props.autocomplete,
		multiple: props.multiple,
		'aria-invalid': isInvalid.value,
		'aria-describedby':
			!hasInvalid.value && hasHint.value
				? hasDescribedBy.value
				: undefined,
		'aria-errormessage': hasInvalid.value ? hasDescribedBy.value : undefined
	}
})

const { getOptionLabel, getOptionValue } = useOptions(props)

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
		return props.modelValue
	},
	set: (newValue) => {
		emit('update:modelValue', newValue)
	}
})
</script>

<template>
	<div :class="bemCssClasses">
		<label v-if="label" :for="hasId">{{ label }}</label>
		<!-- #region native select -->
		<div class="vv-select__wrapper">
			<slot name="before">
				<vv-icon v-if="hasIconLeft" v-bind="hasIcon" />
			</slot>
			<select
				:id="hasId"
				ref="select"
				v-model="localModelValue"
				v-bind="hasAttrs">
				<option v-if="placeholder" :value="undefined" disabled>
					{{ placeholder }}
				</option>
				<option
					v-for="(option, index) in options"
					:key="index"
					:disabled="getDisabled(option)"
					:value="getOptionValue(option)">
					{{ getOptionLabel(option) }}
				</option>
			</select>
			<slot name="after">
				<vv-icon v-if="hasIconRight" v-bind="hasIcon" />
			</slot>
		</div>
		<!-- #endregion native select -->
		<HintSlot :id="hasDescribedBy" class="vv-select__hint" />
	</div>
</template>
