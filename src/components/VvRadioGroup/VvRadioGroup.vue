<script lang="ts">
	export default {
		name: 'VvRadioGroup',
	}
</script>

<script setup lang="ts">
	import type { Option } from '@/types/generic'
	import type { InputGroupState } from '@/types/group'
	import { INJECTION_KEY_RADIO_GROUP } from '@/constants'
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
	const { disabled, readonly, vertical, valid, invalid, modifiers } =
		toRefs(props)

	useProvideGroupState<InputGroupState>({
		key: INJECTION_KEY_RADIO_GROUP,
		modelValue,
		disabled,
		readonly,
		valid,
		invalid,
	})

	// options
	const { getOptionLabel, getOptionValue } = useOptions(props)

	// styles
	const bemCssClasses = useBemModifiers(
		'vv-radio-group',
		modifiers,
		computed(() => ({
			disabled: disabled.value,
			readonly: readonly.value,
			horizontal: !vertical.value,
			valid: valid.value,
			invalid: invalid.value,
		})),
	)

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
	<fieldset :class="bemCssClasses">
		<legend v-if="label" v-text="label" />
		<div class="vv-radio-group__wrapper">
			<!-- #region options -->
			<template v-if="options.length > 0">
				<VvRadio
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
