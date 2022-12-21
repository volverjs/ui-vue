<script lang="ts">
export default {
	name: 'VvAccordion'
}
</script>

<script setup lang="ts">
import { computed, useAttrs, ref, defineEmits, defineProps } from 'vue'
import { useToggle } from '@vueuse/core'
import { nanoid } from 'nanoid'
import { useBemModifiers } from '@/composables/useModifiers'
import {
	VvAccordionEvents,
	VvAccordionProps,
	useGroupProps
} from '@/components/VvAccordion'

// props, attrs and emit
const props = defineProps(VvAccordionProps)
const attrs = useAttrs()
const emit = defineEmits(VvAccordionEvents)

// data
const accordionName = (attrs?.id as string) || nanoid()
const { modifiers, title, content, disabled, collapse, modelValue, isInGroup } =
	useGroupProps(props, emit)
const localModelValue = ref(false)
const isOpen = computed({
	get: () => {
		if (isInGroup.value) {
			if (collapse.value) {
				return modelValue.value.includes(accordionName)
			}
			return modelValue.value === accordionName
		}
		// localModelValue is used when the accordion is not in a group
		if (modelValue.value === undefined) {
			return localModelValue.value
		}
		return modelValue.value
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
		// localModelValue is used when the accordion is not in a group
		if (modelValue.value === undefined) {
			localModelValue.value = newValue
			return
		}
		modelValue.value = newValue
	}
})

// styles
const { bemCssClasses } = useBemModifiers('vv-accordion', {
	modifiers,
	disabled
})

// methods
const onClick = useToggle(isOpen)
</script>

<template>
	<details
		:id="accordionName"
		:class="bemCssClasses"
		:open="isOpen"
		@click.prevent="onClick()">
		<summary
			:aria-controls="accordionName"
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
