<script lang="ts">
	export default {
		name: 'VvAccordionGroup',
	}
</script>

<script setup lang="ts">
	import type { Ref } from 'vue'
	import type { AccordionGroupState } from '../../types/group'
	import { INJECTION_KEY_ACCORDION_GROUP } from '../../constants'
	import VvAccordion from '../VvAccordion/VvAccordion.vue'
	import { VvAccordionGroupProps, VvAccordionGroupEvents } from '.'

	// props and emit
	const props = defineProps(VvAccordionGroupProps)
	const emit = defineEmits(VvAccordionGroupEvents)

	// data
	const { disabled, collapse, modifiers, itemModifiers, items, not } =
		toRefs(props)
	watchEffect(() => {
		if (typeof props.modelValue === 'string' && collapse.value) {
			// eslint-disable-next-line
			console.warn(
				`[VvAccordionGroup]: modelValue is a string but collapse is true.`,
			)
		}
	})
	let localModelValue: Ref<string[]> = ref([])
	watch(
		() => props.storeKey,
		(newKey) => {
			if (newKey) {
				localModelValue = useStorage(newKey, localModelValue.value)
			} else {
				localModelValue = ref([])
			}
		},
		{ immediate: true },
	)
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
	useProvideGroupState<AccordionGroupState>({
		key: INJECTION_KEY_ACCORDION_GROUP,
		modelValue,
		disabled,
		collapse,
		modifiers: itemModifiers,
		not,
	})

	// styles
	const bemCssClasses = useModifiers(
		'vv-accordion-group',
		modifiers,
		computed(() => ({
			disabled: disabled.value,
		})),
	)
</script>

<template>
	<div :class="bemCssClasses">
		<!-- @slot Default slot -->
		<slot>
			<VvAccordion
				v-for="item in items"
				:key="item.title"
				v-bind="{
					name: item.name,
					title: item.title,
					content: item.content,
				}"
			>
				<template #header="data">
					<!-- @slot Slot for accordion header -->
					<slot v-bind="data" :name="`header::${item.name}`" />
				</template>
				<template #details="data">
					<!-- @slot Slot for accordion details -->
					<slot v-bind="data" :name="`details::${item.name}`" />
				</template>
			</VvAccordion>
		</slot>
	</div>
</template>
