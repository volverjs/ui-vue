<template>
	<details
		:class="accordionClass"
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
import { computed, useAttrs, toRefs, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { AccordionGroupState } from '../../composables/group/models'
import { VvAccordionProps, VvAccordionEvents } from './VvAccordion'

//Composables
import { useAccordionGroup } from '../../composables/group/useAccordionGroup'
import { useBemModifiers } from '../../composables/useModifiers'

// Define component props, attributes and events emitted
const props = defineProps(VvAccordionProps)
const attrs = useAttrs()
const emit = defineEmits(VvAccordionEvents)

//Data
const { modifiers, bordered, disabled = ref(false), iconRight } = toRefs(props)

// #region group
const accordionName = ref(attrs?.name || uuidv4())
const accordionGroupState = new AccordionGroupState({
	modelValue: accordionName,
	disabled,
	bordered,
	iconRight
})
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

//Styles & bindings
const { bemCssClasses: accordionClass } = useBemModifiers('vv-accordion', {
	modifiers,
	disabled: isDisabled,
	markerRight: hasIconRight,
	bordered: isBordered
})

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
