<script lang="ts">
	export default {
		name: 'VvCheckboxGroup',
	}
</script>

<script setup lang="ts">
	import type { Option } from '../../types/generic'
	import type { InputGroupState } from '../../types/group'
	import { INJECTION_KEY_CHECK_GROUP } from '../../constants'
	import { HintSlotFactory } from '../common/HintSlot'
	import VvCheckbox from '../VvCheckbox/VvCheckbox.vue'
	import { VvCheckboxGroupProps, VvCheckboxGroupEvents } from '.'

	// props, emit and slots
	const props = defineProps(VvCheckboxGroupProps)
	const emit = defineEmits(VvCheckboxGroupEvents)
	const slots = useSlots()

	// props merged with volver defaults (now only for labels)
	const propsDefaults = useDefaults<typeof VvCheckboxGroupProps>(
		'VvCheckboxGroup',
		VvCheckboxGroupProps,
		props,
	)

	// data
	const modelValue = useVModel(props, 'modelValue', emit)
	const { disabled, readonly, vertical, valid, invalid, modifiers } =
		toRefs(props)

	useProvideGroupState<InputGroupState>({
		key: INJECTION_KEY_CHECK_GROUP,
		modelValue,
		disabled,
		readonly,
		valid,
		invalid,
	})

	// options
	const { getOptionLabel, getOptionValue } = useOptions(props)

	// stypes
	const bemCssClasses = useModifiers(
		'vv-checkbox-group',
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
	const { HintSlot, hintSlotScope } = HintSlotFactory(propsDefaults, slots)
</script>

<template>
	<fieldset :class="bemCssClasses">
		<legend v-if="label" v-text="label" />
		<div class="vv-checkbox-group__wrapper">
			<!-- #region options set up -->
			<template v-if="options.length > 0">
				<VvCheckbox
					v-for="(option, index) in options"
					:key="index"
					v-bind="getOptionProps(option, index)"
				/>
			</template>
			<!-- #endregion -->
			<slot v-else />
		</div>
		<HintSlot class="vv-checkbox-group__hint">
			<template v-if="$slots.hint" #hint>
				<slot name="hint" v-bind="hintSlotScope" />
			</template>
			<template v-if="$slots.loading" #loading>
				<slot name="loading" v-bind="hintSlotScope" />
			</template>
			<template v-if="$slots.valid" #valid>
				<slot name="valid" v-bind="hintSlotScope" />
			</template>
			<template v-if="$slots.invalid" #invalid>
				<slot name="invalid" v-bind="hintSlotScope" />
			</template>
		</HintSlot>
	</fieldset>
</template>
