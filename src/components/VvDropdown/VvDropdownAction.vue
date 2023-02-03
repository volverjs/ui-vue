<script lang="ts">
	export default {
		name: 'VvDropdownAction',
	}
</script>

<script setup lang="ts">
	import VvAction from '@/components/VvAction/VvAction.vue'
	import VvDropdownItem from '@/components/VvDropdown/VvDropdownItem.vue'
	import { ActionProps, ModifiersProps } from '@/props'

	// props
	const props = defineProps({
		...ActionProps,
		...ModifiersProps,
	})

	/**
	 * @description Define component classes with BEM style.
	 * @returns {Array} The component classes.
	 */
	const { modifiers } = toRefs(props)
	const bemCssClasses = useBemModifiers('vv-dropdown-action', modifiers)
</script>

<template>
	<VvDropdownItem>
		<VvAction
			v-bind="{
				disabled,
				pressed,
				active,
				type,
				to,
				href,
				target,
				rel,
			}"
			:class="bemCssClasses"
		>
			<slot />
		</VvAction>
	</VvDropdownItem>
</template>
