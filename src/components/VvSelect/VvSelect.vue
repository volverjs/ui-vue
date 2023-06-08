<script lang="ts">
	export default {
		name: 'VvSelect',
	}
</script>

<script setup lang="ts">
	import type { SelectHTMLAttributes } from 'vue'
	import VvIcon from '../VvIcon/VvIcon.vue'
	import HintSlotFactory from '../common/HintSlot'
	import { VvSelectProps, VvSelectEmits } from '.'
	import type { Option } from '@/types/generic'

	// props, emit and slots
	const props = defineProps(VvSelectProps)
	const emit = defineEmits(VvSelectEmits)
	const slots = useSlots()

	// props merged with volver defaults (now only for labels)
	const propsDefaults = useDefaults<typeof VvSelectProps>(
		'VvSelect',
		VvSelectProps,
		props,
	)

	// template refs
	const select = ref()

	// hint
	const {
		HintSlot,
		hasHintLabelOrSlot,
		hasInvalidLabelOrSlot,
		hintSlotScope,
	} = HintSlotFactory(propsDefaults, slots)

	// data
	const {
		id,
		modifiers,
		disabled,
		readonly,
		loading,
		icon,
		iconPosition,
		invalid,
		valid,
		floating,
		multiple,
	} = toRefs(props)

	// computed
	const hasId = useUniqueId(id)
	const hasHintId = computed(() => `${hasId.value}-hint`)

	// focus
	const { focused } = useComponentFocus(select, emit)

	// visibility
	const isVisible = useElementVisibility(select)
	watch(isVisible, (newValue) => {
		if (newValue && props.autofocus) {
			focused.value = true
		}
	})

	// icons
	const { hasIcon, hasIconBefore, hasIconAfter } = useComponentIcon(
		icon,
		iconPosition,
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
	const bemCssClasses = useModifiers(
		'vv-select',
		modifiers,
		computed(() => ({
			valid: valid.value,
			invalid: invalid.value,
			loading: loading.value,
			disabled: disabled.value,
			readonly: readonly.value,
			'icon-before': hasIconBefore.value,
			'icon-after': hasIconAfter.value,
			dirty: isDirty.value,
			focus: focused.value,
			floating: floating.value,
			multiple: multiple.value,
		})),
	)

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
			'aria-describedby': hasHintLabelOrSlot.value
				? hasHintId.value
				: undefined,
			'aria-errormessage': hasInvalidLabelOrSlot.value
				? hasHintId.value
				: undefined,
		}
	})

	// slots
	const slotProps = computed(() => ({
		valid: props.valid,
		invalid: props.invalid,
		modelValue: props.modelValue,
	}))

	const {
		getOptionLabel,
		getOptionValue,
		getOptionDisabled,
		getOptionGrouped,
	} = useOptions(props)

	const localModelValue = computed({
		get: () => {
			return props.modelValue
		},
		set: (newValue) => {
			if (Array.isArray(newValue)) {
				newValue = newValue.filter((item) => item !== undefined)
			}
			emit('update:modelValue', newValue)
		},
	})

	// Grouped options
	const isGroup = (option: string | Option) => {
		if (typeof option === 'string') return false
		return option && option.options && option.options.length > 0
	}
</script>

<template>
	<div :class="bemCssClasses">
		<label v-if="label" :for="hasId">{{ label }}</label>
		<!-- #region native select -->
		<div class="vv-select__wrapper">
			<div v-if="$slots.before" class="vv-select__input-before">
				<!-- @slot Slot before input -->
				<slot name="before" v-bind="slotProps" />
			</div>
			<div class="vv-select__inner">
				<VvIcon
					v-if="hasIconBefore"
					class="vv-select__icon"
					v-bind="hasIcon"
				/>
				<select
					:id="hasId"
					ref="select"
					v-model="localModelValue"
					v-bind="hasAttrs"
				>
					<option
						v-if="placeholder"
						:value="undefined"
						:disabled="!unselectable"
						:hidden="!unselectable"
					>
						{{ placeholder }}
					</option>
					<template v-for="(option, index) in options">
						<option
							v-if="!isGroup(option)"
							:key="index"
							:disabled="getOptionDisabled(option)"
							:value="getOptionValue(option)"
						>
							{{ getOptionLabel(option) }}
						</option>
						<optgroup
							v-else
							:key="`group-${index}`"
							:disabled="getOptionDisabled(option)"
							:label="getOptionLabel(option)"
						>
							<option
								v-for="(item, i) in getOptionGrouped(option)"
								:key="`group-${index}-item-${i}`"
								:disabled="getOptionDisabled(item)"
								:value="getOptionValue(item)"
							>
								{{ getOptionLabel(item) }}
							</option>
						</optgroup>
					</template>
				</select>
				<VvIcon
					v-if="hasIconAfter"
					class="vv-select__icon vv-select__icon-after"
					v-bind="hasIcon"
				/>
			</div>
			<div v-if="$slots.after" class="vv-select__input-after">
				<!-- @slot Slot after input -->
				<slot name="after" v-bind="slotProps" />
			</div>
		</div>
		<!-- #endregion native select -->
		<HintSlot :id="hasHintId" class="vv-select__hint">
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
	</div>
</template>
