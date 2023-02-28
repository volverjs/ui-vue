<script lang="ts">
	export default {
		name: 'VvDropdownItem',
	}
</script>

<script setup lang="ts">
	const { role, expanded } = useInjectedDropdownItem()
	const element = ref(null)
	useProvideDropdownAction({ expanded })
	const hovered = useElementHover(element)
	const { focused } = useFocus(element)
	const { focused: focusedWithin } = useFocusWithin(element)

	// focus item on hover
	watch(hovered, (newValue) => {
		if (newValue) {
			focused.value = true
		}
	})
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
