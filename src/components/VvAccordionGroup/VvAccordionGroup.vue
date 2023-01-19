<script lang="ts">
	export default {
		name: 'VvAccordionGroup',
	}
</script>

<script setup lang="ts">
	import { type Ref, computed, ref, toRefs, watchEffect } from 'vue'
	import type IAccordionGroupState from '@/composables/group/types/IAccordionGroupState'
	import { VV_ACCORDION_GROUP } from '@/constants'
	import { useProvideGroupState } from '@/composables/group/useProvideGroupState'
	import { useBemModifiers } from '@/composables/useModifiers'
	import VvAccordion from '@/components/VvAccordion/VvAccordion.vue'
	import {
		VvAccordionGroupProps,
		VvAccordionGroupEvents,
	} from '@/components/VvAccordionGroup/'

	// props and emit
	const props = defineProps(VvAccordionGroupProps)
	const emit = defineEmits(VvAccordionGroupEvents)

	// data
	const { disabled, collapse, modifiers, itemModifiers, items } =
		toRefs(props)
	watchEffect(() => {
		if (typeof props.modelValue === 'string' && collapse.value) {
			// eslint-disable-next-line
			console.warn(
				`[VvAccordionGroup]: modelValue is a string but collapse is true.`,
			)
		}
	})
	const localModelValue: Ref<string[]> = ref([])
	const modelValue = computed({
		get: () => {
			if (props.modelValue !== undefined) {
				if (!collapse.value) {
					return Array.isArray(props.modelValue)
						? props.modelValue[0]
						: props.modelValue
				}
				return props.modelValue
			}
			return !collapse.value
				? localModelValue.value?.[0]
				: localModelValue.value
		},
		set: (newValue) => {
			if (props.modelValue !== undefined) {
				if (
					(Array.isArray(props.modelValue) || collapse.value) &&
					!Array.isArray(newValue)
				) {
					newValue = [newValue]
				}
				return emit('update:modelValue', newValue)
			}
			localModelValue.value = Array.isArray(newValue)
				? newValue
				: [newValue]
		},
	})

	// provide
	const accordionGroupState: IAccordionGroupState = {
		key: VV_ACCORDION_GROUP,
		modelValue,
		disabled,
		collapse,
		modifiers: itemModifiers,
	}
	useProvideGroupState(accordionGroupState)

	// styles
	const { bemCssClasses } = useBemModifiers('vv-accordion-group', {
		modifiers,
		disabled,
	})
</script>

<template>
	<div :class="bemCssClasses">
		<slot>
			<vv-accordion
				v-for="item in items"
				:key="item.title"
				v-bind="{
					name: item.name,
					title: item.title,
					content: item.content,
				}"
			>
				<template #header="data">
					<slot v-bind="data" :name="`header::${item.name}`" />
				</template>
				<template #details="data">
					<slot v-bind="data" :name="`details::${item.name}`" />
				</template>
			</vv-accordion>
		</slot>
	</div>
</template>
