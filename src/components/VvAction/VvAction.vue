<script lang="ts">
	export default {
		name: 'VvAction',
	}
</script>

<script setup lang="ts">
	import { VvActionProps, VvActionEvents } from '.'
	import { ActionTag } from '../../constants'

	// props and emit
	const props = defineProps(VvActionProps)
	const emit = defineEmits(VvActionEvents)
	const instance = getCurrentInstance()

	// inject plugin
	const volver = useVolver()

	const element = ref<HTMLElement | null>(null)
	defineExpose({ $el: element })

	// drowpdown trigger
	const {
		reference: dropdownTriggerReference,
		bus: dropdownEventBus,
		aria: dropdownAria,
		expanded: dropdownExpanded,
	} = useInjectedDropdownTrigger()
	watch(
		() => element.value,
		(newValue) => {
			if (dropdownTriggerReference) {
				dropdownTriggerReference.value = newValue
			}
		},
	)

	// pressed
	const pressed = computed(() => {
		return props.pressed || dropdownExpanded?.value
	})

	// dropdown parent
	const { role } = useInjectedDropdownAction()

	/**
	 * @description The tag defined by props.
	 * @returns {string} The tag.
	 */
	const hasTag = computed(() => {
		switch (true) {
			case props.disabled:
				return ActionTag.button
			case props.to !== undefined:
				return volver?.nuxt ? ActionTag.nuxtLink : ActionTag.routerLink
			case props.href !== undefined:
				return ActionTag.a
			default:
				return props.defaultTag // button
		}
	})

	/**
	 * @description Define component attributes.
	 * @returns {Object} The component attributes.
	 */
	const hasProps = computed(() => {
		const toReturn = {
			...dropdownAria?.value,
			ariaPressed: pressed.value ? true : undefined,
			ariaLabel: props.ariaLabel,
			role: role?.value,
		}
		switch (hasTag.value) {
			case ActionTag.a:
				return {
					...toReturn,
					href: props.href,
					target: props.target,
					rel: props.rel,
				}
			case ActionTag.routerLink:
			case ActionTag.nuxtLink:
				return {
					...toReturn,
					to: props.to,
					target: props.target,
				}
			case ActionTag.button:
				return {
					...toReturn,
					type: props.type,
					disabled: props.disabled,
				}
			default:
				return toReturn
		}
	})

	/**
	 * @description Catch click event
	 */
	const onClick = (e: Event) => {
		if (props.disabled) {
			e.preventDefault()
			return
		}
		if (instance?.vnode.props?.onClick) {
			emit('click', e)
			return
		}
		dropdownEventBus?.emit('click', e)
	}

	/**
	 * @description Catch mouseover event
	 */
	const onMouseover = (e: Event) => {
		if (instance?.vnode.props?.onMouseover) {
			emit('mouseover', e)
			return
		}
		dropdownEventBus?.emit('mouseover', e)
	}

	/**
	 * @description Catch mouseleave event
	 */
	const onMouseleave = (e: Event) => {
		if (instance?.vnode.props?.onMouseleave) {
			emit('mouseleave', e)
			return
		}
		dropdownEventBus?.emit('mouseleave', e)
	}
</script>

<template>
	<component
		v-bind="hasProps"
		:is="hasTag"
		ref="element"
		:class="{
			active,
			pressed,
			disabled,
			current,
		}"
		@click.passive="onClick"
		@mouseover.passive="onMouseover"
		@mouseleave.passive="onMouseleave"
	>
		<!-- @slot Default slot -->
		<slot>
			{{ label }}
		</slot>
	</component>
</template>
