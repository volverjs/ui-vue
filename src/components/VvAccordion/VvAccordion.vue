<template>
	<details :class="hasClass" @click="emit('update:open', !props.open)">
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
import { GroupState } from '../../composables/group/models'
import { useGroupOrLocalState } from '../../composables/group/useGroupOrLocalState'
import type { IGroupOptions } from '../../composables/group/types'
import { VV_ACCORDION_GROUP } from '../../constants'

interface VvAccordionProps {
	/**
	 * Accordion header title
	 */
	title: string
	/**
	 * Accordion content description
	 */
	content: string
	/**
	 * Defines if item is open
	 */
	open: boolean
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
const groupOptions: IGroupOptions = {
	disabled: props.disabled ?? false,
	modelValue: accordionName
}
// Create groupState instance
const groupState = new GroupState(VV_ACCORDION_GROUP, groupOptions)
// Use group composable to inject the provided group (from parent accordion group)
const { isDisabled, checkIsSelected } = useGroupOrLocalState(
	groupState.key,
	groupState
)
// #endregion group

const isOpen = computed(() => checkIsSelected(accordionName) || props.open)

const hasClass = computed(() => [
	'vv-accordion',
	hasModifiers.value,
	{
		'vv-accordion--disabled': isDisabled.value,
		'vv-accordion--marker-right': props.iconRight,
		'vv-accordion--bordered': props.bordered
	}
])
</script>

<style lang="scss">
@import '@volverjs/style/scss/components/vv-accordion';
</style>
