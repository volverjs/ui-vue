<script lang="ts">
export default {
	name: 'VvAccordion'
}
</script>

<script setup lang="ts">
import { computed, useAttrs, ref } from 'vue'
import { nanoid } from 'nanoid'
import { VvAccordionProps, VvAccordionEvents } from './VvAccordion'
import { toAccordionRefs } from './useAccordionProps'
import { useBemModifiers } from '@/composables/useModifiers'
import { equals, contains, removeFromList } from '@/utils/ObjectUtilities'

// props, attrs and emit
const props = defineProps(VvAccordionProps)
const attrs = useAttrs()
const emit = defineEmits(VvAccordionEvents)

// data
const accordionName = attrs?.name || nanoid()
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
		? equals(accordionName, modelValue.value)
		: contains(accordionName, modelValue.value)
})

// styles
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
				? removeFromList(accordionName, modelValue.value)
				: [...modelValue.value, accordionName]
		}
		// prevent auto-toggle in group mode
		e.preventDefault()
	}
}
</script>

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
