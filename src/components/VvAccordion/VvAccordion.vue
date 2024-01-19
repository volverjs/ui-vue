<script lang="ts">
	export default {
		name: 'VvAccordion',
	}
</script>

<script setup lang="ts">
	import { uid } from 'uid'
	import { VvAccordionEvents, VvAccordionProps, useGroupProps } from '.'

	// props, attrs and emit
	const props = defineProps(VvAccordionProps)
	const attrs = useAttrs()
	const emit = defineEmits(VvAccordionEvents)
	const modelValue = useVModel(props, 'modelValue', emit)

	// data
	const accordionName = computed(
		() => props.name || (attrs?.id as string) || uid(),
	)
	const { title, content, not } = toRefs(props)
	const { isInGroup, modifiers, disabled, bus } = useGroupProps(props)

	// state
	const isExpanded = ref(false)
	watch(
		modelValue,
		(newValue) => {
			if (typeof newValue === 'boolean') {
				isExpanded.value = not.value ? !newValue : newValue
			}
		},
		{ immediate: true },
	)
	watch(isExpanded, (newValue) => {
		modelValue.value = not.value ? !newValue : newValue
	})
	bus?.on('toggle', ({ name, value }) => {
		if (name !== accordionName.value) {
			return
		}
		isExpanded.value = value
	})
	const onClick = () => {
		if (disabled.value) {
			return
		}
		if (isInGroup.value) {
			bus?.emit('toggle', {
				name: accordionName.value,
				value: !isExpanded.value,
			})
			return
		}
		isExpanded.value = !isExpanded.value
	}

	// register / unregister
	watch(
		accordionName,
		(newValue, oldValue) => {
			if (bus) {
				if (oldValue && oldValue !== newValue) {
					bus.emit('unregister', { name: oldValue })
				}
				bus.emit('register', { name: newValue })
			}
		},
		{
			immediate: true,
		},
	)
	onBeforeUnmount(() => {
		if (bus) {
			bus.emit('unregister', { name: accordionName.value })
		}
	})

	// methods
	const expand = () => {
		if (isExpanded.value) {
			return
		}
		onClick()
	}

	const collapse = () => {
		if (!isExpanded.value) {
			return
		}
		onClick()
	}

	const groupExpand = (name?: string | string[]) => {
		if (!bus) {
			// eslint-disable-next-line no-console
			console.warn(
				`[VvAccordion]: You are trying to expand accordion group of "${accordionName.value}" but it is not in a group`,
			)
			return
		}
		bus.emit('expand', { name })
	}

	const groupCollapse = (name?: string | string[]) => {
		if (!bus) {
			// eslint-disable-next-line no-console
			console.warn(
				`[VvAccordion]: You are trying to collapse accordion group of "${accordionName.value}" but it is not in a group`,
			)
			return
		}
		bus?.emit('collapse', { name })
	}

	// expose
	defineExpose({
		isExpanded,
		expand,
		collapse,
		groupExpand,
		groupCollapse,
	})

	// styles
	const bemCssClasses = useModifiers(
		'vv-accordion',
		modifiers,
		computed(() => ({
			disabled: disabled.value,
		})),
	)
</script>

<template>
	<details :id="accordionName" :class="bemCssClasses" :open="isExpanded">
		<summary
			:aria-controls="accordionName"
			:aria-expanded="isExpanded"
			class="vv-accordion__summary"
			@click.prevent="onClick()"
		>
			<!-- @slot Slot for title -->
			<slot
				name="summary"
				v-bind="{
					isExpanded,
					expand,
					collapse,
					groupExpand,
					groupCollapse,
				}"
			>
				{{ title }}
			</slot>
		</summary>
		<div :aria-hidden="!isExpanded" class="vv-accordion__content">
			<!-- @slot Slot for content  -->
			<slot
				v-bind="{
					isExpanded,
					expand,
					collapse,
					groupExpand,
					groupCollapse,
				}"
			>
				{{ content }}
			</slot>
		</div>
	</details>
</template>
