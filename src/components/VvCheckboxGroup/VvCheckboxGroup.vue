<script lang="ts">
export default {
	name: 'VvCheckboxGroup'
}
</script>

<script setup lang="ts">
import { useSlots, computed, toRefs } from 'vue'
import type { IInputGroupState } from '@/composables/group/types/IInputGroup'
import { VV_CHECK_GROUP } from '@/constants'
import { useVModel } from '@vueuse/core'
import { useProvideGroupState } from '@/composables/group/useProvideGroupState'
import { useOptions } from '@/composables/options/useOptions'
import { useBemModifiers } from '@/composables/useModifiers'
import { HintSlotFactory } from '@/components/common/HintSlot'
import VvCheckbox from '@/components/VvCheckbox/VvCheckbox.vue'
import {
	VvCheckboxGroupProps,
	VvCheckboxGroupEvents
} from '@/components/VvCheckboxGroup'

// props, emit and slots
const props = defineProps(VvCheckboxGroupProps)
const emit = defineEmits(VvCheckboxGroupEvents)
const slots = useSlots()

// data
const modelValue = useVModel(props, 'modelValue', emit)
const { disabled, readonly, error, valid } = toRefs(props)

const groupState: IInputGroupState = {
	key: VV_CHECK_GROUP,
	modelValue,
	disabled,
	readonly
}
useProvideGroupState(groupState)

// options
const { getOptionLabel, getOptionValue } = useOptions(props)

// stypes
const { bemCssClasses: hasClass } = useBemModifiers('vv-checkbox-group', {
	horizontal: computed(() => !props.vertical),
	valid,
	invalid: error
})

// methods
const getOptionProps = (option: unknown, oIndex: number) => {
	return {
		id: `${props.name}_opt${oIndex}`,
		name: props.name,
		label: getOptionLabel(option),
		value: getOptionValue(option)
	}
}
const { HintSlot } = HintSlotFactory(props, slots)
</script>

<template>
	<fieldset :class="hasClass">
		<legend v-if="label" v-text="label" />
		<div class="vv-checkbox-group__wrapper">
			<!-- #region options set up -->
			<template v-if="options.length > 0">
				<vv-checkbox
					v-for="(o, oIndex) in options"
					:key="oIndex"
					v-bind="getOptionProps(o, oIndex)" />
			</template>
			<!-- #endregion options set up -->
			<!-- #region default -->
			<slot v-else />
			<!-- #endregion default -->
		</div>
		<HintSlot class="vv-checkbox-group__hint" />
	</fieldset>
</template>
