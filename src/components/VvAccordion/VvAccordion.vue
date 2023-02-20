<script lang="ts">
	export default {
		name: 'VvAccordion',
	}
</script>

<script setup lang="ts">
	import { nanoid } from 'nanoid'
	import {
		VvAccordionEvents,
		VvAccordionProps,
		useGroupProps,
	} from '@/components/VvAccordion'

	// props, attrs and emit
	const props = defineProps(VvAccordionProps)
	const attrs = useAttrs()
	const emit = defineEmits(VvAccordionEvents)

	// data
	const accordionName = computed(
		() => props.name || (attrs?.id as string) || nanoid(),
	)
	const {
		modifiers,
		title,
		content,
		disabled,
		collapse,
		modelValue,
		isInGroup,
		not,
	} = useGroupProps(props, emit)
	const localModelValue = ref(false)
	const isOpen = computed({
		get: () => {
			let toReturn = modelValue.value as boolean
			if (isInGroup.value) {
				if (collapse.value && Array.isArray(modelValue.value)) {
					toReturn = modelValue.value.includes(accordionName.value)
				} else {
					toReturn = modelValue.value === accordionName.value
				}
			} else if (modelValue.value === undefined) {
				// localModelValue is used when the accordion is not in a group
				toReturn = localModelValue.value
			}
			return not.value ? !toReturn : toReturn
		},
		set: (newValue) => {
			if (not.value) {
				newValue = !newValue
			}
			if (isInGroup.value) {
				if (collapse.value && Array.isArray(modelValue.value)) {
					if (newValue) {
						modelValue.value.push(accordionName.value)
						return
					}
					modelValue.value = modelValue.value.filter(
						(name: string) => name !== accordionName.value,
					)
					return
				}
				modelValue.value = newValue ? accordionName.value : null
				return
			}
			// localModelValue is used when the accordion is not in a group
			if (
				modelValue.value === undefined &&
				typeof newValue === 'boolean'
			) {
				localModelValue.value = newValue
				return
			}
			modelValue.value = newValue
		},
	})

	// styles
	const bemCssClasses = useModifiers(
		'vv-accordion',
		modifiers,
		computed(() => ({
			disabled: disabled.value,
		})),
	)

	// methods
	const onClick = useToggle(isOpen)
</script>

<template>
	<details :id="accordionName" :class="bemCssClasses" :open="isOpen">
		<summary
			:aria-controls="accordionName"
			:aria-expanded="isOpen"
			class="vv-accordion__summary"
			@click.prevent="onClick()"
		>
			<!-- @slot Slot for title -->
			<slot name="summary" v-bind="{ open: isOpen }">
				{{ title }}
			</slot>
		</summary>
		<div :aria-hidden="!isOpen" class="vv-accordion__content">
			<!-- @slot Slot for content  -->
			<slot name="default" v-bind="{ open: isOpen }">
				{{ content }}
			</slot>
		</div>
	</details>
</template>
