<script lang="ts">
	export default {
		name: 'VvCombobox',
		components: { VvDropdown, VvDropdownOption },
	}
</script>

<script setup lang="ts">
	import type { Ref } from 'vue'
	import { VvComboboxProps, VvComboboxEvents } from '.'
	import VvIcon from '../VvIcon/VvIcon.vue'
	import VvDropdown from '../VvDropdown/VvDropdown.vue'
	import VvDropdownOption from '../VvDropdown/VvDropdownOption.vue'
	import VvSelect from '../VvSelect/VvSelect.vue'
	import VvBadge from '../VvBadge/VvBadge.vue'
	import HintSlotFactory from '../common/HintSlot'
	import type { Option } from '../../types/generic'
	import { DropdownRole } from '../../constants'

	// props, emit and slots
	const props = defineProps(VvComboboxProps)
	const emit = defineEmits(VvComboboxEvents)
	const slots = useSlots()

	// props merged with volver defaults (now only for labels)
	const propsDefaults = useDefaults<typeof VvComboboxProps>(
		'VvCombobox',
		VvComboboxProps,
		props,
	)

	// hint slot
	const { HintSlot } = HintSlotFactory(props, slots)

	// template ref
	const inputEl: Ref<HTMLElement | null> = ref(null)
	const inputSearchEl: Ref<HTMLElement | null> = ref(null)
	const wrapperEl: Ref<HTMLElement | null> = ref(null)

	// focus
	const { focused } = useComponentFocus(inputEl, emit)
	const { focused: focusedWithin } = useFocusWithin(wrapperEl)

	watch(focused, (newValue) => {
		if (!props.autoOpen) {
			return
		}
		if (newValue && !expanded.value) {
			expand()
			return
		}
		if (!newValue && expanded.value && !focusedWithin.value) {
			collapse()
		}
	})

	watch(focusedWithin, (newValue) => {
		if (!focused.value && !newValue && expanded.value) {
			collapse()
		}
	})

	// search
	const searchText = ref('')
	const debouncedSearchText = refDebounced(
		searchText,
		Number(props.debounceSearch),
	)
	watch(debouncedSearchText, () =>
		emit('change:search', debouncedSearchText.value),
	)

	// expanded
	const expanded = ref(false)
	const toggleExpanded = () => {
		if (props.disabled || props.readonly) return
		expanded.value = !expanded.value
	}
	const expand = () => {
		if (props.disabled || props.readonly || expanded.value) return
		expanded.value = true
	}
	const collapse = () => {
		if (props.disabled || props.readonly || !expanded.value) return
		expanded.value = false
	}
	watch(expanded, (newValue) => {
		if (searchable.value) {
			nextTick(() => {
				if (newValue) {
					if (inputSearchEl.value) {
						inputSearchEl.value.focus()
					}
					return
				}
				searchText.value = ''
			})
		}
	})

	// data
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

	// icons
	const { hasIcon, hasIconBefore, hasIconAfter } = useComponentIcon(
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
	const bemCssClasses = useModifiers(
		'vv-select',
		modifiers,
		computed(() => ({
			disabled: disabled.value,
			loading: loading.value,
			readonly: readonly.value,
			'icon-before': Boolean(hasIconBefore.value),
			'icon-after': Boolean(hasIconAfter.value),
			valid: valid.value,
			invalid: invalid.value,
			dirty: isDirty.value,
			focus: focused.value,
			floating: floating.value,
		})),
	)

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
			selectedValues = props.modelValue as Array<typeof props.modelValue>
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

	watch(selectedOptions, () => {
		if (!props.multiple && props.autoClose) {
			collapse()
		}
	})

	/**
	 * Function triggered on click on input
	 */
	const onClickInput = () => {
		props.autoOpen ? expand() : toggleExpanded()
	}

	/**
	 * Function triggered on input of checkbox or radio (multple or single mode)
	 * @param event on input event (checkbox or radio input)
	 */
	const onInput = (option: string | Option) => {
		if (props.disabled || props.readonly) {
			return
		}

		const value = getOptionValue(option)

		let toReturn: string | string[] | Option | Option[] | undefined = value
		// Check multiple prop, override value with array and remove or add the value
		if (props.multiple) {
			// check maxValues prop and block check new values
			if (Array.isArray(props.modelValue)) {
				const maxValues = Number(props.maxValues)
				if (
					props.maxValues !== undefined &&
					maxValues >= 0 &&
					props.modelValue?.length >= maxValues
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
		} else {
			if (props.autoClose) {
				collapse()
			}
			if (props.unselectable && value === props.modelValue) {
				toReturn = undefined
			}
		}
		emit('update:modelValue', toReturn)
	}

	const selectProps = computed(() => ({
		id: hasId.value,
		name: props.name,
		tabindex: hasTabindex.value,
		valid: valid.value,
		validLabel: propsDefaults.value.validLabel,
		invalid: invalid.value,
		invalidLabel: propsDefaults.value.invalidLabel,
		hintLabel: propsDefaults.value.hintLabel,
		loading: loading.value,
		loadingLabel: propsDefaults.value.loadingLabel,
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
		strategy: props.strategy,
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

	// slots
	const slotProps = computed(() => ({
		valid: props.valid,
		invalid: props.invalid,
		modelValue: props.modelValue,
	}))

	// computed
	onKeyStroke([' ', 'Enter'], (e) => {
		if (props.autoOpen) {
			return
		}
		if (!expanded.value && focused.value) {
			e.preventDefault()
			e.stopImmediatePropagation()
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
				:role="DropdownRole.listbox"
			>
				<template
					v-if="searchable || $slots['dropdown::before']"
					#before
				>
					<!-- @slot Slot before dropdown items -->
					<slot name="dropdown::before" />
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
						spellcheck="false"
						type="search"
						class="vv-dropdown__search"
						:placeholder="propsDefaults.searchPlaceholder"
					/>
				</template>
				<template #default="{ aria }">
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
						<div
							ref="inputEl"
							v-bind="aria"
							:aria-labelledby="hasLabelId"
							class="vv-select__input"
							role="combobox"
							:tabindex="hasTabindex"
							@click.passive="onClickInput"
						>
							<!-- @slot Slot for value customization -->
							<slot
								name="value"
								v-bind="{ selectedOptions, onInput }"
							>
								<template v-if="hasValue">
									<template v-if="!badges">
										{{ hasValue }}
									</template>
									<VvBadge
										v-for="(
											option, index
										) in selectedOptions"
										v-else
										:key="index"
										:modifiers="badgeModifiers"
										class="vv-select__badge"
									>
										{{ getOptionLabel(option) }}
										<button
											v-if="
												unselectable &&
												!readonly &&
												!disabled
											"
											:aria-label="
												propsDefaults.deselectActionLabel
											"
											@click.stop="onInput(option)"
										>
											<VvIcon name="close" />
										</button>
									</VvBadge>
								</template>
								<template v-else>
									{{ placeholder }}
								</template>
							</slot>
						</div>
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
				</template>
				<template #items>
					<template v-if="filteredOptions.length">
						<VvDropdownOption
							v-for="(option, index) in filteredOptions"
							v-bind="{
								disabled: getOptionDisabled(option),
								selected: getOptionSelected(option),
								unselectable,
								deselectHintLabel:
									propsDefaults.deselectHintLabel,
								selectHintLabel: propsDefaults.selectHintLabel,
								selectedHintLabel:
									propsDefaults.selectedHintLabel,
							}"
							:key="index"
							class="vv-dropdown-option"
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
						</VvDropdownOption>
					</template>
					<VvDropdownOption
						v-else-if="!options.length"
						modifiers="inert"
					>
						<!-- @slot Slot for no options available -->
						<slot name="no-options">
							{{ propsDefaults.noOptionsLabel }}
						</slot>
					</VvDropdownOption>
					<VvDropdownOption v-else modifiers="inert">
						<!-- @slot Slot for no results available -->
						<slot name="no-results">
							{{ propsDefaults.noResultsLabel }}
						</slot>
					</VvDropdownOption>
				</template>
				<template v-if="$slots['dropdown::after']" #after>
					<!-- @slot Slot after dropdown items -->
					<slot name="dropdown::after" />
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
