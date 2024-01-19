<script lang="ts">
	export default {
		name: 'VvAccordionGroup',
	}
</script>

<script setup lang="ts">
	import mitt from 'mitt'
	import type {
		AccordionGroupState,
		AccordionGroupBusEvents,
	} from '../../types/group'
	import { INJECTION_KEY_ACCORDION_GROUP } from '../../constants'
	import VvAccordion from '../VvAccordion/VvAccordion.vue'
	import { VvAccordionGroupProps, VvAccordionGroupEvents } from '.'

	// props and emit
	const props = defineProps(VvAccordionGroupProps)
	const emit = defineEmits(VvAccordionGroupEvents)

	// data
	const { disabled, modifiers, itemModifiers, items } = toRefs(props)
	watchEffect(() => {
		if (typeof props.modelValue === 'string' && props.collapse) {
			// eslint-disable-next-line no-console
			console.warn(
				`[VvAccordionGroup]: modelValue is a string but collapse is true.`,
			)
		}
	})

	const accordionNames = reactive(new Set<string>())
	let modelValue = ref(new Set<string>())
	watch(
		() => props.storeKey,
		(newKey, oldKey) => {
			if (oldKey && oldKey !== newKey) {
				localStorage.removeItem(oldKey)
			}
			if (newKey) {
				modelValue = useLocalStorage(newKey, modelValue.value)
				return
			}
			modelValue = ref(new Set<string>(modelValue.value))
		},
		{ immediate: true },
	)
	watch(
		[modelValue, accordionNames, () => props.not, () => props.collapse],
		() => {
			if (props.not) {
				emit(
					'update:modelValue',
					[...accordionNames].filter(
						(name) => !modelValue.value.has(name),
					),
				)
				return
			}
			if (props.collapse) {
				emit('update:modelValue', [...modelValue.value])
				return
			}
			emit('update:modelValue', modelValue.value.values().next().value)
		},
		{
			deep: true,
			immediate: true,
		},
	)
	watch(
		() => props.modelValue,
		(newValue, oldValue) => {
			if (
				newValue === undefined ||
				newValue === null ||
				JSON.stringify(newValue) === JSON.stringify(oldValue)
			) {
				return
			}
			let toReturn = new Set<string>()
			if (props.not) {
				if (typeof newValue === 'string') {
					toReturn = new Set<string>(
						[...accordionNames].filter((name) => name !== newValue),
					)
				} else if (Array.isArray(newValue)) {
					toReturn = new Set<string>(
						[...accordionNames].filter(
							(name) => !newValue.includes(name),
						),
					)
				}
			} else if (typeof newValue === 'string') {
				toReturn = new Set<string>([newValue])
			} else if (Array.isArray(newValue)) {
				toReturn = new Set<string>(newValue)
			}
			for (const name of accordionNames) {
				bus.emit('toggle', { name, value: toReturn.has(name) })
			}
			modelValue.value = toReturn
		},
		{
			immediate: true,
		},
	)

	// provide
	const bus = mitt<AccordionGroupBusEvents>()
	useProvideGroupState<AccordionGroupState>(INJECTION_KEY_ACCORDION_GROUP, {
		disabled,
		modifiers: itemModifiers,
		bus,
	})
	bus.on('register', ({ name }) => {
		accordionNames.add(name)
	})
	bus.on('unregister', ({ name }) => {
		accordionNames.delete(name)
	})
	bus.on('toggle', ({ name, value }) => {
		if (value) {
			if (!props.collapse) {
				for (const item of modelValue.value) {
					if (item !== name) {
						bus.emit('toggle', { name: item, value: false })
					}
				}
				modelValue.value.clear()
			}
			modelValue.value.add(name)
			return
		}
		modelValue.value.delete(name)
	})
	const expand = (name?: string | string[]) => {
		if (typeof name === 'string') {
			bus.emit('toggle', { name, value: true })
			return
		}
		if (Array.isArray(name)) {
			for (const item of name) {
				bus.emit('toggle', { name: item, value: true })
			}
			return
		}
		for (const item of accordionNames) {
			bus.emit('toggle', { name: item, value: true })
		}
	}
	bus.on('expand', ({ name }) => expand(name))

	const collapse = (name?: string | string[]) => {
		if (typeof name === 'string') {
			bus.emit('toggle', { name, value: false })
			return
		}
		if (Array.isArray(name)) {
			for (const item of name) {
				bus.emit('toggle', { name: item, value: false })
			}
			return
		}
		for (const item of accordionNames) {
			bus.emit('toggle', { name: item, value: false })
		}
	}
	bus.on('collapse', ({ name }) => collapse(name))

	// expose
	defineExpose({ modelValue, expand, collapse })

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
		<slot
			v-bind="{
				modelValue,
				expand,
				collapse,
			}"
		>
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
