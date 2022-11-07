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
import type IAccordionGroupState from '@/composables/group2/types/IAccordionGroupState'

import { toRefs } from 'vue'
import { VV_ACCORDION_GROUP } from './../../constants'

//Components
import VvAccordion from '../../components/VvAccordion/VvAccordion.vue'

//Composables
import { useVModel } from '@vueuse/core'
import { useProvideGroupState } from '../../composables/group2/useProvideGroupState'
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
const accordionGroupState: IAccordionGroupState = {
	key: VV_ACCORDION_GROUP,
	modelValue,
	disabled,
	bordered,
	iconRight,
	accordion
}
useProvideGroupState(accordionGroupState)
// #endregion group

//Styles & bindings
const { bemCssClasses: accGroupClass } = useBemModifiers('vv-accordion-group', {
	modifiers,
	disabled
})
</script>
