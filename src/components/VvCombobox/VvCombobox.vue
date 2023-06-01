<script lang="ts">
	export default {
		name: 'VvCombobox',
		components: {
			VvDropdown,
			VvDropdownOption,
			VvDropdownOptgroup,
			VvButton,
		},
	}
</script>

<script setup lang="ts">
	import type { Ref } from 'vue'
	import { VvComboboxProps, VvComboboxEvents } from '.'
	import VvIcon from '../VvIcon/VvIcon.vue'
	import VvDropdown from '../VvDropdown/VvDropdown.vue'
	import VvDropdownOption from '../VvDropdown/VvDropdownOption.vue'
	import VvDropdownOptgroup from '../VvDropdown/VvDropdownOptgroup.vue'
	import VvSelect from '../VvSelect/VvSelect.vue'
	import VvBadge from '../VvBadge/VvBadge.vue'
	import VvButton from '../VvButton/VvButton.vue'
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

	// Grouped options
	const isGroup = (option: string | Option) => {
		if (typeof option === 'string') {
			return false
		}
		return option.options && option.options.length > 0
	}

	// hint slot
	const {
		HintSlot,
		hasHintLabelOrSlot,
		hasInvalidLabelOrSlot,
		hintSlotScope,
	} = HintSlotFactory(props, slots)

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
	const onAfterExpand = () => {
		if (searchable.value) {
			if (inputSearchEl.value) {
				inputSearchEl.value.focus({
					preventScroll: true,
				})
			}
		}
	}
	const onAfterCollapse = () => {
		if (searchable.value) {
			searchText.value = ''
		}
	}

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

	// ref
	const dropdownEl = ref()

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
			badges: props.badges,
		})),
	)

	const {
		getOptionLabel,
		getOptionValue,
		getOptionDisabled,
		getOptionGrouped,
	} = useOptions(props)

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
		const options = props.options.reduce((acc, value) => {
			if (isGroup(value)) {
				return [...acc, ...getOptionGrouped(value)]
			}
			return [...acc, value]
		}, [] as Array<Option | string>)

		return options.filter((option) => {
			if (isGroup(option)) {
				return getOptionGrouped(option).some((item) =>
					selectedValues.includes(getOptionValue(item)),
				)
			}
			return selectedValues.includes(getOptionValue(option))
		})
	})

	const hasValue = computed(() => {
		return selectedOptions.value
			.map((option) => getOptionLabel(option))
			.join(props.separator)
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
			if (!props.keepOpen) {
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
		modifiers: propsDefaults.value.modifiers,
		options: propsDefaults.value.options,
		labelKey: propsDefaults.value.labelKey,
		valueKey: propsDefaults.value.valueKey,
		icon: propsDefaults.value.icon,
		iconPosition: propsDefaults.value.iconPosition,
		floating: propsDefaults.value.floating,
		unselectable: propsDefaults.value.unselectable,
		multiple: propsDefaults.value.multiple,
		label: propsDefaults.value.label,
		placeholder: propsDefaults.value.placeholder,
		modelValue: props.modelValue,
	}))

	const dropdownProps = computed(() => ({
		id: hasDropdownId.value,
		reference: wrapperEl.value,
		placement: propsDefaults.value.placement,
		strategy: propsDefaults.value.strategy,
		transitionName: propsDefaults.value.transitionName,
		offset: propsDefaults.value.offset,
		shift: propsDefaults.value.shift,
		flip: propsDefaults.value.flip,
		autoPlacement: propsDefaults.value.autoPlacement,
		arrow: propsDefaults.value.arrow,
		autofocusFirst: searchable.value
			? false
			: propsDefaults.value.autofocusFirst,
		triggerWidth: propsDefaults.value.triggerWidth,
		modifiers: propsDefaults.value.dropdownModifiers,
	}))

	// slots
	const slotProps = computed(() => ({
		valid: props.valid,
		invalid: props.invalid,
		modelValue: props.modelValue,
	}))

	// computed
	onKeyStroke(
		[' ', 'Enter'],
		(e) => {
			if (props.autoOpen) {
				return
			}
			if (!expanded.value && focused.value) {
				e.preventDefault()
				e.stopImmediatePropagation()
				toggleExpanded()
			}
		},
		{ target: inputEl },
	)
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
				ref="dropdownEl"
				v-model="expanded"
				v-bind="dropdownProps"
				:role="DropdownRole.listbox"
				@after-expand="onAfterExpand"
				@after-collapse="onAfterCollapse"
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
							class="vv-select__input"
							role="combobox"
							:aria-expanded="expanded"
							:aria-labelledby="hasLabelId"
							:aria-describedby="
								hasHintLabelOrSlot ? hasHintId : undefined
							"
							:aria-errormessage="
								hasInvalidLabelOrSlot ? hasHintId : undefined
							"
							:tabindex="hasTabindex"
							@click.passive="onClickInput"
						>
							<!-- @slot Slot for value customization -->
							<slot
								name="value"
								v-bind="{ selectedOptions, onInput }"
							>
								<template v-if="hasValue">
									<div
										v-if="!badges"
										class="vv-select__value"
									>
										{{ hasValue }}
									</div>
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
						<template
							v-for="(option, index) in filteredOptions"
							:key="index"
						>
							<template v-if="isGroup(option)">
								<VvDropdownOptgroup
									:label="getOptionLabel(option)"
								/>
								<VvDropdownOption
									v-for="(item, i) in getOptionGrouped(
										option,
									)"
									v-bind="{
										disabled: getOptionDisabled(item),
										selected: getOptionSelected(item),
										unselectable,
										deselectHintLabel:
											propsDefaults.deselectHintLabel,
										selectHintLabel:
											propsDefaults.selectHintLabel,
										selectedHintLabel:
											propsDefaults.selectedHintLabel,
									}"
									:key="i"
									class="vv-dropdown-option"
									@click.passive="onInput(item)"
								>
									<!-- @slot Slot for option customization -->
									<slot
										name="option"
										v-bind="{
											option,
											selectedOptions,
											selected: getOptionSelected(item),
											disabled: getOptionDisabled(item),
										}"
									>
										{{ getOptionLabel(item) }}
									</slot>
								</VvDropdownOption>
							</template>
							<VvDropdownOption
								v-else
								v-bind="{
									disabled: getOptionDisabled(option),
									selected: getOptionSelected(option),
									unselectable,
									deselectHintLabel:
										propsDefaults.deselectHintLabel,
									selectHintLabel:
										propsDefaults.selectHintLabel,
									selectedHintLabel:
										propsDefaults.selectedHintLabel,
								}"
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
				<template #after>
					<!-- @slot Slot after dropdown items -->
					<slot name="dropdown::after">
						<!-- Close button if dropdown custom position is enabled and floating-ui disabled -->
						<VvButton
							v-if="dropdownEl?.customPosition"
							label="Close"
							modifiers="secondary"
							@click="dropdownEl.hide()"
						/>
					</slot>
				</template>
			</VvDropdown>
		</div>
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
	<VvSelect
		v-else
		v-bind="selectProps"
		@update:model-value="emit('update:modelValue', $event)"
	/>
</template>
