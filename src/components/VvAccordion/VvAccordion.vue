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
import type { ComputedRef } from 'vue'
import type { IAccordionGroupOptions } from '../../composables/group/types'

import { computed, useAttrs } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { AccordionGroupState } from '../../composables/group/models'
import { VvAccordionProps, VvAccordionEvents } from './VvAccordion'

//Composables
import { useModifiers } from '../../composables/useModifiers'
import { useAccordionGroup } from '../../composables/group/useAccordionGroup'

// Define component props, attributes and events emitted
const props = defineProps(VvAccordionProps)
const attrs = useAttrs()
const emit = defineEmits(VvAccordionEvents)

// Get computed string with all css classes (modifiers) with 'vv-accordion' prefix
const hasModifiers: ComputedRef<string> = useModifiers(
	'vv-accordion',
	props.modifiers as string | string[]
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
const accordionGroupState = new AccordionGroupState(accordionGroupOptions)
// Use group composable to inject the provided group (from parent accordion group)
const {
	isDisabled,
	hasIconRight,
	isBordered,
	isInGroup,
	isSelectedInGroup,
	toggleElement
} = useAccordionGroup(accordionGroupState.key, accordionGroupState)
// #endregion group

const isOpen = computed(() => {
	return isInGroup.value ? isSelectedInGroup.value : props.open
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
// Toggle is used for accordion single element
const onToggle = (e: Event) => {
	const target = e.target as HTMLDetailsElement
	// Emit toggle opened value
	emit('update:open', target.open)
}

// Click is handled for toggleElement from group modelValue (array or single string value)
const onClick = (e: Event) => {
	// Update modelValue watched from group provider
	if (isInGroup.value) {
		toggleElement()
		// prevent auto-toggle in group mode
		e.preventDefault()
	}
}
</script>
