<template>
	<div :class="accGroupClass">
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
import { toRefs, ref } from 'vue'
import { AccordionGroupState } from '../../composables/group/models'

//Components
import VvAccordion from '../../components/VvAccordion/VvAccordion.vue'

//Composables
import { useVModel } from '@vueuse/core'
import { useProvideGroupState } from '../../composables/group/useGroup'
import { useBemModifiers } from '../../composables/useModifiers'

import {
	VvAccordionGroupProps,
	VvAccordionGroupEvents
} from './VvAccordionGroup'

// Define component props, attributes and events emitted
const props = defineProps(VvAccordionGroupProps)
const emit = defineEmits(VvAccordionGroupEvents)

//Data
const modelValue = useVModel(props, 'modelValue', emit)
const { disabled, bordered, iconRight, accordion, modifiers, items } =
	toRefs(props)

// #region group
const accordionGroupState = new AccordionGroupState({
	modelValue,
	disabled,
	bordered,
	iconRight,
	accordion
})
useProvideGroupState(accordionGroupState, emit)
// #endregion group

//Styles & bindings
const { bemCssClasses: accGroupClass } = useBemModifiers('vv-accordion-group', {
	modifiers,
	disabled
})
</script>
