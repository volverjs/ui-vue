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
import { computed, useAttrs, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { VvAccordionProps, VvAccordionEvents } from './VvAccordion'

//Composables
import { toAccordionRefs } from './useAccordionProps'
import { useBemModifiers } from '../../composables/useModifiers'
import ObjectUtilities from '@/utils/ObjectUtilities'

// Define component props, attributes and events emitted
const props = defineProps(VvAccordionProps)
const attrs = useAttrs()
const emit = defineEmits(VvAccordionEvents)

//Data
const accordionName = attrs?.name || uuidv4()
const {
	modelValue,
	modifiers,
	bordered,
	disabled = ref(false),
	iconRight,
	isInGroup,
	accordion
} = toAccordionRefs(props, emit)

const isOpen = computed(() => {
	if (!isInGroup.value) return props.open

	return accordion.value
		? ObjectUtilities.equals(accordionName, modelValue.value)
		: ObjectUtilities.contains(accordionName, modelValue.value)
})

//Styles & bindings
const { bemCssClasses: accordionClass } = useBemModifiers('vv-accordion', {
	modifiers,
	disabled,
	markerRight: computed(() => iconRight.value),
	bordered
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
		if (accordion.value) {
			modelValue.value = isOpen.value ? null : accordionName
		} else {
			modelValue.value = isOpen.value
				? ObjectUtilities.removeFromList(
						accordionName,
						modelValue.value
				  )
				: [...modelValue.value, accordionName]
		}
		// prevent auto-toggle in group mode
		e.preventDefault()
	}
}
</script>
