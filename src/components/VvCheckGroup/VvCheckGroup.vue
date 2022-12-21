<script lang="ts">
export default {
	name: 'VvCheckGroup'
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
import VvCheck from '@/components/VvCheck/VvCheck.vue'
import {
	VvCheckGroupProps,
	VvCheckGroupEvents
} from '@/components/VvCheckGroup'

// props, emit and slots
const props = defineProps(VvCheckGroupProps)
const emit = defineEmits(VvCheckGroupEvents)
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
const { bemCssClasses: hasClass } = useBemModifiers('vv-input-checkbox-group', {
	horizontal: computed(() => !props.vertical),
	valid,
	invalid: error
})

// methods
const getOptionProps = (option: any, oIndex: number) => {
	return {
		id: `${props.name}_opt${oIndex}`,
		name: props.name,
		label: getOptionLabel(option),
		value: getOptionValue(option)
	}
}
const HintSlot = HintSlotFactory(props, slots)
</script>

<template>
	<fieldset :class="hasClass">
		<legend v-if="label" v-text="label" />
		<div class="vv-input-checkbox-group__wrapper">
			<!-- #region options set up -->
			<template v-if="options.length > 0">
				<vv-check
					v-for="(o, oIndex) in options"
					:key="oIndex"
					v-bind="getOptionProps(o, oIndex)" />
			</template>
			<!-- #endregion options set up -->
			<!-- #region default -->
			<slot v-else />
			<!-- #endregion default -->
		</div>
		<HintSlot class="vv-input-checkbox-group__hint" />
	</fieldset>
</template>
