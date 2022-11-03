<template>
	<fieldset :class="groupClass">
		<legend v-if="label" v-text="label" />
		<div class="vv-input-radio-group__wrapper">
			<!-- #region options set up -->
			<template v-if="options.length > 0">
				<vv-radio
					v-for="(o, oIndex) in options"
					:key="oIndex"
					v-bind="getOptionProps(o, oIndex)" />
			</template>
			<!-- #endregion options set up -->
			<!-- #region default -->
			<slot v-else />
			<!-- #endregion default -->
		</div>
		<!-- @slot error,valid,hint,loading vanno vanno qua -->
		<HintSlot class="vv-input-radio-group__hint" />
	</fieldset>
</template>

<script setup lang="ts">
import { useSlots, computed, toRefs } from 'vue'
import { InputGroupState } from '../../composables/group/models'
import { VvRadioGroupProps, VvRadioGroupEvents } from './VvRadioGroup'

//Composables
import { useVModel } from '@vueuse/core'
import { useProvideGroupState } from '../../composables/group/useGroup'
import { useOptions } from '../../composables/options/useOptions'
import { useBemModifiers } from '@/composables/useModifiers'

//Constants
import { VV_RADIO_GROUP } from '../../constants'

//Components
import VvRadio from '../../components/VvRadio/VvRadio.vue'
import { HintSlotFactory } from '../common/HintSlot'

//Props, Emits, Slots e Attrs
const emit = defineEmits(VvRadioGroupEvents)
const props = defineProps(VvRadioGroupProps)
const slots = useSlots()

//Data
const modelValue = useVModel(props, 'modelValue', emit)
const { disabled, readonly, vertical, valid, error } = toRefs(props)

// #region group
const groupState = new InputGroupState(VV_RADIO_GROUP, {
	modelValue,
	disabled,
	readonly
})
useProvideGroupState(groupState, emit)
// #endregion group

//OPTIONS
const { getOptionLabel, getOptionValue } = useOptions(props)

//Styles & Bindings
const { bemCssClasses: groupClass } = useBemModifiers('vv-input-radio-group', {
	horizontal: computed(() => !vertical.value),
	valid,
	invalid: error
})

//Methods
function getOptionProps(option: any, oIndex: number) {
	return {
		id: `${props.name}_opt${oIndex}`,
		name: props.name,
		label: getOptionLabel(option),
		value: getOptionValue(option)
	}
}

const HintSlot = HintSlotFactory(props, slots)
</script>
