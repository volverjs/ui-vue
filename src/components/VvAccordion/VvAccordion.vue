<script lang="ts">
export default {
	name: 'VvAccordion'
}
</script>

<script setup lang="ts">
import { computed, useAttrs, ref } from 'vue'
import { useToggle } from '@vueuse/core'
import { nanoid } from 'nanoid'
import { VvAccordionProps, VvAccordionEvents } from './VvAccordion'
import { toAccordionRefs } from './useAccordionProps'
import { useBemModifiers } from '@/composables/useModifiers'

// props, attrs and emit
const props = defineProps(VvAccordionProps)
const attrs = useAttrs()
const emit = defineEmits(VvAccordionEvents)

// data
const accordionName = attrs?.name || nanoid()
const { modifiers, disabled, collapse, isInGroup, modelValue } =
	toAccordionRefs(props, emit)
const localOpen = ref(false)
const isOpen = computed({
	get: () => {
		if (isInGroup.value) {
			if (collapse.value) {
				return modelValue.value.includes(accordionName)
			}
			return modelValue.value === accordionName
		}
		if (props.open !== undefined) {
			return props.open
		}
		return localOpen.value
	},
	set: (newValue) => {
		if (isInGroup.value) {
			if (collapse.value) {
				if (newValue) {
					modelValue.value.push(accordionName)
					return
				}
				modelValue.value = modelValue.value.filter(
					(name: string) => name !== accordionName
				)
				return
			}
			modelValue.value = newValue ? accordionName : null
			return
		}
		if (props.open !== undefined) {
			return emit('update:open', newValue)
		}
		localOpen.value = newValue
	}
})

// styles
const { bemCssClasses: accordionClass } = useBemModifiers('vv-accordion', {
	modifiers,
	disabled
})

// methods
const onClick = useToggle(isOpen)
</script>

<template>
	<details :class="accordionClass" :open="isOpen" @click.prevent="onClick()">
		<summary
			:aria-controls="`#${accordionName}`"
			:aria-expanded="isOpen"
			class="vv-collapse__summary">
			<slot name="header" v-bind="{ open: isOpen }">
				{{ title }}
			</slot>
		</summary>
		<div :aria-hidden="!isOpen" class="vv-collapse__content">
			<slot name="details" v-bind="{ open: isOpen }">
				{{ content }}
			</slot>
		</div>
	</details>
</template>
