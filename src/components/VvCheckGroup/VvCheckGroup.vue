<template>
	<fieldset :class="groupClass">
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
		<!-- @slot error,valid,hint,loading vanno vanno qua -->
		<HintSlot class="vv-input-checkbox-group__hint" />
	</fieldset>
</template>

<script setup lang="ts">
import type { IInputGroupState } from '@/composables/group/types/IInputGroup'

import { useSlots, computed, toRefs } from 'vue'
import { VvCheckGroupProps, VvCheckGroupEvents } from './VvCheckGroup'

//Costanti
import { VV_CHECK_GROUP } from '../../constants'

//Composables
import { useVModel } from '@vueuse/core'
import { useProvideGroupState } from '../../composables/group/useProvideGroupState'
import { useOptions } from '../../composables/options/useOptions'
import { useBemModifiers } from '@/composables/useModifiers'

//Components
import VvCheck from '../../components/VvCheck/VvCheck.vue'
import { HintSlotFactory } from '../common/HintSlot'

//Props, Emits, Slots e Attrs
const props = defineProps(VvCheckGroupProps)
const emit = defineEmits(VvCheckGroupEvents)
const slots = useSlots()

//Data
const modelValue = useVModel(props, 'modelValue', emit)
const { disabled, readonly, error, valid } = toRefs(props)

// #region group
const groupState: IInputGroupState = {
	key: VV_CHECK_GROUP,
	modelValue,
	disabled,
	readonly
}
useProvideGroupState(groupState)
// #endregion group

// OPTIONS
const { getOptionLabel, getOptionValue } = useOptions(props)

//Styles & Bindings
const { bemCssClasses: groupClass } = useBemModifiers(
	'vv-input-checkbox-group',
	{
		horizontal: computed(() => !props.vertical),
		valid,
		invalid: error
	}
)

//Methods
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
