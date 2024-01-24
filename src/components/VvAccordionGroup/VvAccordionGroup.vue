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
	// eslint-disable-next-line
	const emit = defineEmits(VvAccordionGroupEvents)

	// data
	const {
		disabled,
		modifiers,
		itemModifiers,
		items,
		storageKey,
		storageType,
	} = toRefs(props)
	watchEffect(() => {
		if (typeof props.modelValue === 'string' && props.collapse) {
			// eslint-disable-next-line no-console
			console.warn(
				`[VvAccordionGroup]: modelValue is a string but collapse is true.`,
			)
		}
	})

	const accordionNames = reactive(new Set<string>())
	const storageModelValue = usePersistence<string | string[] | undefined>(
		storageKey,
		storageType,
	)
	const localModelValue = computed({
		get: () => {
			if (props.modelValue !== null && props.modelValue !== undefined) {
				return props.modelValue
			}
			return storageModelValue.value
		},
		set: (newValue) => {
			emit('update:modelValue', newValue)
			storageModelValue.value = newValue
		},
	})
	const expandedAccordions = computed<Set<string>>({
		get: () => {
			if (localModelValue.value === undefined) {
				return new Set<string>()
			}
			let toReturn = new Set<string>()
			if (props.not) {
				if (typeof localModelValue.value === 'string') {
					toReturn = new Set<string>(
						[...accordionNames].filter(
							(name) => name !== localModelValue.value,
						),
					)
				} else if (Array.isArray(localModelValue.value)) {
					toReturn = new Set<string>(
						[...accordionNames].filter(
							(name) =>
								!(localModelValue.value as string[]).includes(
									name,
								),
						),
					)
				}
			} else if (typeof localModelValue.value === 'string') {
				toReturn = new Set<string>([localModelValue.value])
			} else if (Array.isArray(localModelValue.value)) {
				toReturn = new Set<string>(localModelValue.value)
			}
			return toReturn
		},
		set: (newValue) => {
			if (props.not) {
				localModelValue.value = [...accordionNames].filter(
					(name) => !newValue.has(name),
				)
				return
			}
			if (props.collapse) {
				localModelValue.value = [...newValue]
				return
			}
			localModelValue.value = newValue.values().next().value
		},
	})
	onMounted(() => {
		if (props.not && localModelValue.value === undefined) {
			localModelValue.value = props.collapse
				? []
				: [...accordionNames.values()].splice(1, accordionNames.size)
		}
		nextTick(() => {
			for (const name of accordionNames) {
				bus.emit('toggle', {
					name,
					value: expandedAccordions.value.has(name),
				})
			}
		})
	})

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
		const newValue = new Set<string>(expandedAccordions.value)
		if (value) {
			if (!props.collapse) {
				for (const item of newValue) {
					if (item !== name) {
						bus.emit('toggle', { name: item, value: false })
					}
				}
				newValue.clear()
			}
			newValue.add(name)
			expandedAccordions.value = newValue
			return
		}
		newValue.delete(name)
		expandedAccordions.value = newValue
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
	defineExpose({ expandedAccordions, expand, collapse })

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
				expandedAccordions,
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
				<template
					v-if="$slots[`summary::${item.name}`]"
					#summary="data"
				>
					<!-- @slot Slot for accordion header -->
					<slot v-bind="data" :name="`summary::${item.name}`" />
				</template>
				<template
					v-if="$slots[`content::${item.name}`]"
					#default="data"
				>
					<!-- @slot Slot for accordion details -->
					<slot v-bind="data" :name="`content::${item.name}`" />
				</template>
			</VvAccordion>
		</slot>
	</div>
</template>
