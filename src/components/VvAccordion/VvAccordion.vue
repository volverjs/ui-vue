<template>
	<details
		:class="hasClass"
		:open="isOpen"
		@toggle="onToggle"
		@click="onClick">
		<summary
			:aria-controls="`#${accordionName}`"
			:aria-expanded="isOpen"
			class="vv-collapse__summary">
			<slot name="header">
				{{ title }}
			</slot>
		</summary>
		<div :aria-hidden="!isOpen" class="vv-collapse__content">
			<slot name="details">
				{{ content }}
			</slot>
		</div>
	</details>
</template>

<script setup lang="ts">
import { computed, useAttrs, type ComputedRef } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { useModifiers } from '../../composables/useModifiers'
import { AccordionGroupState } from '../../composables/group/models'
import type { IAccordionGroupOptions } from '../../composables/group/types'
import { VV_ACCORDION_GROUP } from '../../constants'
import { useAccordionGroup } from '../../composables/group/useAccordionGroup'

export interface VvAccordionProps {
	/**
	 * Accordion header title
	 */
	title?: string
	/**
	 * Accordion content description
	 */
	content?: string
	/**
	 * (Optional) Defines if item is open. Event "update:open" is emitted on accordion header click
	 */
	open?: boolean
	/**
	 * Change icon position to right side
	 */
	iconRight?: boolean
	/**
	 * Add border to accordion item
	 */
	bordered?: boolean
	/**
	 * String or String[] of css classes (modifiers) that will be concatenated to prefix 'vv-accordion--'
	 */
	modifiers?: string | string[]
	disabled?: boolean
}

// Define component props, attributes and events emitted
const props = defineProps<VvAccordionProps>()
const attrs = useAttrs()
const emit = defineEmits(['update:open'])

// Get computed string with all css classes (modifiers) with 'vv-accordion' prefix
const hasModifiers: ComputedRef<string> = useModifiers(
	'vv-accordion',
	props.modifiers
)

// #region group
const accordionName = attrs?.name || uuidv4()
// Define group options
const accordionGroupOptions: IAccordionGroupOptions = {
	disabled: props.disabled ?? false,
	modelValue: accordionName,
	bordered: props.bordered,
	iconRight: props.iconRight
}
// Create groupState instance
const accordionGroupState = new AccordionGroupState(
	VV_ACCORDION_GROUP,
	accordionGroupOptions
)
// Use group composable to inject the provided group (from parent accordion group)
const { modelValue, isDisabled, hasIconRight, isBordered, isInGroup } =
	useAccordionGroup(accordionGroupState.key, accordionGroupState)
// #endregion group

const isOpen = computed(() => {
	return isInGroup.value ? modelValue.value === accordionName : props.open
})

const hasClass = computed(() => [
	'vv-accordion',
	hasModifiers.value,
	{
		'vv-accordion--disabled': isDisabled.value,
		'vv-accordion--marker-right': hasIconRight.value,
		'vv-accordion--bordered': isBordered.value
	}
])

// methods
const onToggle = (e: Event) => {
	const target = e.target as HTMLDetailsElement
	// Emit toggle opened value
	emit('update:open', target.open)
}

const onClick = (e: Event) => {
	// Update modelValue watched from group provider
	if (isInGroup.value) {
		modelValue.value =
			modelValue.value === accordionName ? null : accordionName
		// prevent auto-toggle in group mode
		e.preventDefault()
	}
}
</script>

<style lang="scss">
@import '@volverjs/style/scss/components/vv-accordion';
</style>
