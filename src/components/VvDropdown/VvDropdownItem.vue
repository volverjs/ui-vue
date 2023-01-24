<script lang="ts">
	export default {
		name: 'VvDropdownItem',
	}
</script>

<script setup lang="ts">
	import { useInjectedDropdownItem } from '@/composables/dropdown/useInjectDropdown'
	import { useProvideDropdownAction } from '@/composables/dropdown/useProvideDropdown'

	const { role, expanded } = useInjectedDropdownItem()
	const element = ref(null)
	useProvideDropdownAction({ expanded })
	const { focused } = useFocus(element)
	const { focused: focusedWithin } = useFocusWithin(element)
</script>

<template>
	<li
		v-bind="{ role }"
		ref="element"
		class="vv-dropdown__item"
		:class="{ 'focus-visible': focused || focusedWithin }"
	>
		<slot />
	</li>
</template>
