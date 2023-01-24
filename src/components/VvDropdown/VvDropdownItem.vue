<script lang="ts">
	export default {
		name: 'VvDropdownItem',
	}
</script>

<script setup lang="ts">
	import { useInjectedDropdownItem } from '@/composables/dropdown/useInjectDropdown'
	import { useProvideDropdownAction } from '@/composables/dropdown/useProvideDropdown'

	const { role, expanded } = useInjectedDropdownItem()
	useProvideDropdownAction({ expanded })
</script>

<template>
	<li v-bind="{ role }" class="vv-dropdown__item">
		<slot />
	</li>
</template>
