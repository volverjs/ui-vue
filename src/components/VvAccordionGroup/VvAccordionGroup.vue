<template>
	<div :class="hasClass">
		<template v-if="props.items?.length > 0">
			<vv-accordion
				v-for="item in items"
				:key="item.title"
				v-bind="{
					name: item.name,
					title: item.title,
					content: item.content,
					...props
				}" />
		</template>
		<slot v-else />
	</div>
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue'

import { computed } from 'vue'
import { AccordionGroupState } from '../../composables/group/models'
import type { IAccordionGroupOptions } from '../../composables/group/types'

//Components
import VvAccordion from '../../components/VvAccordion/VvAccordion.vue'

//Composables
import { useModifiers } from '../../composables/useModifiers'
import { useProvideGroupState } from '../../composables/group/useGroup'

import {
	VvAccordionGroupProps,
	VvAccordionGroupEvents
} from './VvAccordionGroup'

// Define component props, attributes and events emitted
const props = defineProps(VvAccordionGroupProps)
const emit = defineEmits(VvAccordionGroupEvents)

// Get computed string with all css classes (modifiers) with 'vv-accordion-group' prefix
const hasModifiers: ComputedRef<string> = useModifiers(
	'vv-accordion-group',
	props.modifiers as string | string[]
)

// #region group
// Define group options
const accordionGroupOptions: IAccordionGroupOptions = {
	disabled: props.disabled ?? false,
	modelValue: props.modelValue || null,
	bordered: props.bordered,
	iconRight: props.iconRight,
	accordion: props.accordion
}
// Create groupState instance
const accordionGroupState = new AccordionGroupState(accordionGroupOptions)
// Use group composable to provide the group state to children
useProvideGroupState(accordionGroupState, emit)
// #endregion group

const hasClass = computed(() => [
	'vv-accordion-group',
	hasModifiers.value,
	{
		'vv-accordion-group--disabled': props.disabled
	}
])
</script>
