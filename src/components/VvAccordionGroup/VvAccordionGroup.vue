<template>
	<div :class="hasClass">
		<template v-if="props.items?.length > 0">
			<vv-accordion
				v-for="item in items"
				:key="item.title"
				v-bind="{
					title: item.title,
					content: item.content,
					...props
				}" />
		</template>
		<slot v-else />
	</div>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { useModifiers } from '../../composables/useModifiers'
import { AccordionGroupState, GroupState } from '../../composables/group/models'
import type {
	IAccordionGroupOptions,
	IGroupOptions
} from '../../composables/group/types'
import { VV_ACCORDION_GROUP } from '../../constants'
import VvAccordion from '../../components/VvAccordion/VvAccordion.vue'
import { useProvideGroupState } from '../../composables/group/useGroup'

interface VvAccordionGroupProps {
	/**
	 * VModel
	 */
	modelValue?: string | string[]
	/**
	 * Change icon position to right side
	 */
	iconRight?: boolean
	/**
	 * Add border to accordion item
	 */
	bordered?: boolean
	/**
	 * Accordion items
	 */
	items?: Array<{
		title: string
		content: string
	}>
	/**
	 * If true, close others accordion when an item is open
	 */
	accordion?: boolean
	/**
	 * String or String[] of css classes (modifiers) that will be concatenated to prefix 'vv-accordion--'
	 */
	modifiers?: string | string[]
	disabled?: boolean
}

// Define component props, attributes and events emitted
const props = withDefaults(defineProps<VvAccordionGroupProps>(), {
	items: () => []
})
const emit = defineEmits(['update:modelValue'])

// Get computed string with all css classes (modifiers) with 'vv-accordion-group' prefix
const hasModifiers: ComputedRef<string> = useModifiers(
	'vv-accordion-group',
	props.modifiers
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
const accordionGroupState = new AccordionGroupState(
	VV_ACCORDION_GROUP,
	accordionGroupOptions
)
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

<style lang="scss">
@import '@volverjs/style/scss/components/vv-accordion';
</style>
