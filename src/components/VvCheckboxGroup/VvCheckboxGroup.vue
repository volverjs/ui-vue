<script lang="ts">
	export default {
		name: 'VvCheckboxGroup',
	}
</script>

<script setup lang="ts">
	import type { Option } from '@/types/generic'
	import type { IInputGroupState } from '@/composables/group/types/IInputGroup'
	import { useSlots, computed, toRefs } from 'vue'
	import { VV_CHECK_GROUP } from '@/constants'
	import { useVModel } from '@vueuse/core'
	import { useProvideGroupState } from '@/composables/group/useProvideGroupState'
	import { useOptions } from '@/composables/useOptions'
	import { useBemModifiers } from '@/composables/useModifiers'
	import { HintSlotFactory } from '@/components/common/HintSlot'
	import VvCheckbox from '@/components/VvCheckbox/VvCheckbox.vue'
	import {
		VvCheckboxGroupProps,
		VvCheckboxGroupEvents,
	} from '@/components/VvCheckboxGroup'

	// props, emit and slots
	const props = defineProps(VvCheckboxGroupProps)
	const emit = defineEmits(VvCheckboxGroupEvents)
	const slots = useSlots()

	// data
	const modelValue = useVModel(props, 'modelValue', emit)
	const { disabled, readonly, vertical, valid, invalid } = toRefs(props)

	const groupState: IInputGroupState = {
		key: VV_CHECK_GROUP,
		modelValue,
		disabled,
		readonly,
		valid,
		invalid,
	}
	useProvideGroupState(groupState)

	// options
	const { getOptionLabel, getOptionValue } = useOptions(props)

	// stypes
	const { bemCssClasses: hasClass } = useBemModifiers('vv-checkbox-group', {
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
	const { HintSlot } = HintSlotFactory(props, slots)
</script>

<template>
	<fieldset :class="hasClass">
		<legend v-if="label" v-text="label" />
		<div class="vv-checkbox-group__wrapper">
			<!-- #region options set up -->
			<template v-if="options.length > 0">
				<vv-checkbox
					v-for="(option, index) in options"
					:key="index"
					v-bind="getOptionProps(option, index)"
				/>
			</template>
			<!-- #endregion options set up -->
			<!-- #region default -->
			<slot v-else />
			<!-- #endregion default -->
		</div>
		<HintSlot class="vv-checkbox-group__hint" />
	</fieldset>
</template>
