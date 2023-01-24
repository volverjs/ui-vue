<script lang="ts">
	export default {
		name: 'VvCombobox',
		components: { VvDropdown, VvDropdownItem },
	}
</script>

<script setup lang="ts">
	import type { Ref } from 'vue'
	import VvIcon from '@/components/VvIcon/VvIcon.vue'
	import VvSelect from '@/components/VvSelect/VvSelect.vue'
	import HintSlotFactory from '@/components/common/HintSlot'
	import { VvComboboxProps, VvComboboxEvents } from '@/components/VvCombobox'
	import { useUniqueId } from '@/composables/useUniqueId'
	import { VvDropdown } from '..'
	import VvDropdownItem from '../VvDropdown/VvDropdownItem.vue'
	import type { Option } from '@/types/generic'

	// props, emit and slots
	const props = defineProps(VvComboboxProps)
	const emit = defineEmits(VvComboboxEvents)
	const slots = useSlots()

	// hint slot
	const { HintSlot } = HintSlotFactory(props, slots)

	// template ref
	const inputEl: Ref<HTMLElement | null> = ref(null)
	const inputSearchEl: Ref<HTMLElement | null> = ref(null)
	const wrapperEl: Ref<HTMLElement | null> = ref(null)

	// focus
	const { focused } = useComponentFocus(inputEl, emit)

	// expanded
	const expanded = ref(false)
	const toggleExpanded = () => {
		if (props.disabled || props.readonly) return
		expanded.value = !expanded.value
	}

	watch(expanded, (newValue) => {
		if (newValue && searchable.value) {
			nextTick(() => {
				if (inputSearchEl.value) {
					inputSearchEl.value.focus()
				}
			})
		}
	})

	// data
	const searchText = ref('')
	const debouncedSearchText = refDebounced(
		searchText,
		Number(props.debounceSearch),
	)
	const {
		id,
		icon,
		iconPosition,
		modifiers,
		disabled,
		readonly,
		loading,
		valid,
		invalid,
		floating,
		searchable,
	} = toRefs(props)
	const hasId = useUniqueId(id)
	const hasHintId = computed(() => `${hasId.value}-hint`)
	const hasDropdownId = computed(() => `${hasId.value}-dropdown`)
	const hasSearchId = computed(() => `${hasId.value}-search`)
	const hasLabelId = computed(() => `${hasId.value}-label`)

	// emit on change search text
	watch(debouncedSearchText, () =>
		emit('change:search', debouncedSearchText.value),
	)

	// icons
	const { hasIcon, hasIconLeft, hasIconRight } = useComponentIcon(
		icon,
		iconPosition,
	)

	// dirty
	const isDirty = computed(() => !isEmpty(props.modelValue))

	// tabindex
	const hasTabindex = computed(() => {
		return disabled.value || readonly.value ? -1 : props.tabindex
	})

	// styles
	const { bemCssClasses } = useBemModifiers('vv-select', {
		modifiers,
		disabled,
		loading,
		readonly,
		iconLeft: hasIconLeft,
		iconRight: hasIconRight,
		valid,
		invalid,
		dirty: isDirty,
		focus: focused,
		floating,
	})

	// current options, filtered or prop options
	const hasOptions = computed(() =>
		props.searchable ? filteredOptions.value : props.options,
	)

	const { getOptionLabel, getOptionValue, getOptionDisabled } =
		useOptions(props)

	// options filtered by search text
	const filteredOptions = computed(() => {
		return props.options?.filter((option) => {
			return getOptionLabel(option)
				.toLowerCase()
				.includes(debouncedSearchText.value.toLowerCase().trim())
		})
	})

	/**
	 * Check if an option exist into modelValue array (multiple) or is equal to modelValue (single)
	 * @param {String | Option} option
	 */
	function getOptionSelected(option: string | Option) {
		if (Array.isArray(props.modelValue)) {
			// check if contain whole option or option value
			return (
				contains(option, props.modelValue) ||
				contains(getOptionValue(option), props.modelValue)
			)
		}
		// check if modelValue is equal to option or option value
		return (
			equals(option, props.modelValue) ||
			equals(getOptionValue(option), props.modelValue)
		)
	}

	/**
	 * Compute the label to show to the user
	 * Check if is multiple mode, object mode or "string" mode
	 */
	const selectedOptions = computed(() => {
		let selectedValues: Array<typeof props.modelValue> = []
		if (Array.isArray(props.modelValue)) {
			selectedValues = props.modelValue
		} else if (props.modelValue) {
			selectedValues = [props.modelValue]
		}
		return props.options.filter((option) =>
			selectedValues.includes(getOptionValue(option)),
		)
	})

	const hasValue = computed(() => {
		return selectedOptions.value
			.map((option) => getOptionLabel(option))
			.join(props.separator)
	})

	/**
	 * Function triggered on input of checkbox or radio (multple or single mode)
	 * @param event on input event (checkbox or radio input)
	 */
	function onInput(option: string | Option) {
		if (props.disabled || props.readonly) {
			return
		}

		const value = getOptionValue(option)

		let toReturn: string | string[] | Option | Option[] | undefined = value
		// Check multiple prop, override value with array and remove or add the value
		if (props.multiple) {
			// check maxValues prop and block check new values
			if (Array.isArray(props.modelValue)) {
				if (
					props.maxValues !== undefined &&
					props.maxValues >= 0 &&
					props.modelValue?.length >= props.maxValues
				) {
					if (!contains(value, props.modelValue)) {
						// maxValues reached
						return
					}
				}
				toReturn = contains(value, props.modelValue)
					? removeFromList(value, props.modelValue)
					: [...props.modelValue, value]
			} else {
				toReturn = [value as Option]
			}
		} else if (props.unselectable && value === props.modelValue) {
			toReturn = undefined
		}
		emit('update:modelValue', toReturn)
	}

	const selectProps = computed(() => ({
		id: hasId.value,
		name: props.name,
		tabindex: hasTabindex.value,
		valid: valid.value,
		validLabel: props.validLabel,
		invalid: invalid.value,
		invalidLabel: props.invalidLabel,
		hintLabel: props.hintLabel,
		loading: loading.value,
		loadingLabel: props.loadingLabel,
		disabled: disabled.value,
		readonly: readonly.value,
		modifiers: props.modifiers,
		options: hasOptions.value,
		labelKey: props.labelKey,
		valueKey: props.valueKey,
		icon: props.icon,
		iconPosition: props.iconPosition,
		floating: props.floating,
		unselectable: props.unselectable,
		multiple: props.multiple,
		label: props.label,
		placeholder: props.placeholder,
		modelValue: props.modelValue,
	}))

	const dropdownProps = computed(() => ({
		id: hasDropdownId.value,
		reference: wrapperEl.value,
		placement: props.placement,
		transitionName: props.transitionName,
		offset: props.offset,
		shift: props.shift,
		flip: props.flip,
		autoPlacement: props.autoPlacement,
		arrow: props.arrow,
		autoClose: props.autoClose,
		autofocusFirst: searchable.value ? false : props.autofocusFirst,
		triggerWidth: props.triggerWidth,
		modifiers: props.dropdownModifiers,
	}))

	// computed
	onKeyStroke([' ', 'Enter'], (e) => {
		if (!expanded.value && focused.value) {
			e.preventDefault()
			toggleExpanded()
		}
	})
</script>

<template>
	<div v-if="!native" :id="hasId" :class="bemCssClasses">
		<label
			v-if="label"
			:id="hasLabelId"
			:for="searchable ? hasSearchId : undefined"
		>
			{{ label }}
		</label>
		<div ref="wrapperEl" class="vv-select__wrapper">
			<VvDropdown
				v-model="expanded"
				v-bind="dropdownProps"
				role="listbox"
			>
				<template v-if="searchable" #before>
					<input
						v-if="searchable"
						v-show="expanded"
						:id="hasSearchId"
						ref="inputSearchEl"
						v-model="searchText"
						aria-autocomplete="list"
						:aria-controls="hasDropdownId"
						:aria-labelledby="hasLabelId"
						:aria-describedby="hasHintId"
						autocomplete="off"
						type="search"
						class="vv-dropdown__search"
						:placeholder="searchPlaceholder"
					/>
				</template>
				<template #default="{ aria }">
					<!-- @slot Slot to replace left icon -->
					<slot name="before">
						<VvIcon
							v-if="hasIconLeft"
							class="vv-select__icon-left"
							v-bind="hasIcon"
						/>
					</slot>
					<div
						ref="inputEl"
						v-bind="aria"
						:aria-labelledby="hasLabelId"
						class="vv-select__input"
						role="combobox"
						:tabindex="hasTabindex"
						@click.passive="toggleExpanded"
					>
						<!-- @slot Slot for value customization -->
						<slot name="value" v-bind="{ selectedOptions }">
							{{ hasValue || placeholder }}
						</slot>
					</div>
					<!-- @slot Slot to replace right icon -->
					<slot name="after">
						<VvIcon
							v-if="hasIconRight"
							class="vv-select__icon-right"
							v-bind="hasIcon"
						/>
					</slot>
				</template>
				<template #items>
					<VvDropdownItem
						v-for="(option, index) in filteredOptions"
						:key="index"
						class="vv-dropdown__action"
						:tabindex="getOptionDisabled(option) ? -1 : 0"
						:class="{
							disabled: getOptionDisabled(option),
							selected: getOptionSelected(option),
						}"
						:aria-selected="getOptionSelected(option)"
						:aria-disabled="getOptionDisabled(option)"
						@click.passive="onInput(option)"
					>
						<!-- @slot Slot for option customization -->
						<slot
							name="option"
							v-bind="{
								option,
								selectedOptions,
								selected: getOptionSelected(option),
								disabled: getOptionDisabled(option),
							}"
						>
							{{ getOptionLabel(option) }}
						</slot>
					</VvDropdownItem>
				</template>
			</VvDropdown>
		</div>
		<HintSlot :id="hasHintId" class="vv-select__hint" />
	</div>
	<VvSelect
		v-else
		v-bind="selectProps"
		@update:model-value="emit('update:modelValue', $event)"
	/>
</template>
