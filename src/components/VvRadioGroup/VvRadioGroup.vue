<script lang="ts">
export default {
	name: 'VvRadioGroup'
}
</script>

<script setup lang="ts">
import { useSlots, computed, toRefs } from 'vue'
import type { IInputGroupState } from '@/composables/group/types/IInputGroup'
import { useVModel } from '@vueuse/core'
import { useProvideGroupState } from '@/composables/group/useProvideGroupState'
import { useOptions } from '@/composables/options/useOptions'
import { useBemModifiers } from '@/composables/useModifiers'
import { VV_RADIO_GROUP } from '@/constants'
import { HintSlotFactory } from '@/components/common/HintSlot'
import VvRadio from '@/components/VvRadio/VvRadio.vue'
import {
	VvRadioGroupProps,
	VvRadioGroupEvents
} from '@/components/VvRadioGroup'

// props, emit and slots
const props = defineProps(VvRadioGroupProps)
const emit = defineEmits(VvRadioGroupEvents)
const slots = useSlots()

// hint
const HintSlot = HintSlotFactory(props, slots)

// data
const modelValue = useVModel(props, 'modelValue', emit)
const { disabled, readonly, vertical, valid, error } = toRefs(props)

const groupState: IInputGroupState = {
	key: VV_RADIO_GROUP,
	modelValue,
	disabled,
	readonly
}
useProvideGroupState(groupState)

const { getOptionLabel, getOptionValue } = useOptions(props)

// styles
const { bemCssClasses: groupClass } = useBemModifiers('vv-radio-group', {
	horizontal: computed(() => !vertical.value),
	valid,
	invalid: error
})

// methods
const getOptionProps = (option: unknown, index: number) => {
	return {
		id: `${props.name}_opt${index}`,
		name: props.name,
		label: getOptionLabel(option),
		value: getOptionValue(option)
	}
}
</script>

<template>
	<fieldset :class="groupClass">
		<legend v-if="label" v-text="label" />
		<div class="vv-radio-group__wrapper">
			<!-- #region options -->
			<template v-if="options.length > 0">
				<vv-radio
					v-for="(o, oIndex) in options"
					:key="oIndex"
					v-bind="getOptionProps(o, oIndex)" />
			</template>
			<!-- #endregion -->
			<!-- #region default -->
			<slot v-else />
			<!-- #endregion -->
		</div>
		<HintSlot class="vv-radio-group__hint" />
	</fieldset>
</template>
