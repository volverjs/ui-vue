<script lang="ts">
	export default {
		name: 'VvRadioGroup',
	}
</script>

<script setup lang="ts">
	import type { Option } from '@/types/generic'
	import type { IInputGroupState } from '@/composables/group/types/IInputGroup'
	import { VV_RADIO_GROUP } from '@/constants'
	import { HintSlotFactory } from '@/components/common/HintSlot'
	import VvRadio from '@/components/VvRadio/VvRadio.vue'
	import {
		VvRadioGroupProps,
		VvRadioGroupEvents,
	} from '@/components/VvRadioGroup'

	// props, emit and slots
	const props = defineProps(VvRadioGroupProps)
	const emit = defineEmits(VvRadioGroupEvents)
	const slots = useSlots()

	// data
	const modelValue = useVModel(props, 'modelValue', emit)
	const { disabled, readonly, vertical, valid, invalid } = toRefs(props)

	const groupState: IInputGroupState = {
		key: VV_RADIO_GROUP,
		modelValue,
		disabled,
		readonly,
		valid,
		invalid,
	}
	useProvideGroupState(groupState)

	// options
	const { getOptionLabel, getOptionValue } = useOptions(props)

	// styles
	const { bemCssClasses: groupClass } = useBemModifiers('vv-radio-group', {
		disabled,
		readonly,
		horizontal: computed(() => !vertical.value),
		valid,
		invalid,
	})

	// methods
	const getOptionProps = (option: string | Option, index: number) => {
		return {
			id: `${props.name}_opt${index}`,
			name: props.name,
			label: getOptionLabel(option),
			value: getOptionValue(option),
		}
	}

	// hint
	const { HintSlot } = HintSlotFactory(props, slots)
</script>

<template>
	<fieldset :class="groupClass">
		<legend v-if="label" v-text="label" />
		<div class="vv-radio-group__wrapper">
			<!-- #region options -->
			<template v-if="options.length > 0">
				<vv-radio
					v-for="(option, index) in options"
					:key="index"
					v-bind="getOptionProps(option, index)"
				/>
			</template>
			<!-- #endregion -->
			<!-- #region default -->
			<slot v-else />
			<!-- #endregion -->
		</div>
		<HintSlot class="vv-radio-group__hint" />
	</fieldset>
</template>
