<script lang="ts">
	export default {
		name: 'VvDropdownItem',
	}
</script>

<script setup lang="ts">
	import { VvDropdownItemProps } from '.'

	const props = defineProps(VvDropdownItemProps)
	const { role, expanded } = useInjectedDropdownItem()
	const element = ref(null)
	useProvideDropdownAction({ expanded })
	const hovered = useElementHover(element)
	const { focused } = useFocus(element)
	const { focused: focusedWithin } = useFocusWithin(element)

	// focus item on hover
	watch(hovered, (newValue) => {
		if (newValue && props.focusOnHover) {
			focused.value = true
		}
	})
</script>

<template>
	<div
		v-bind="{ role }"
		ref="element"
		class="vv-dropdown__item"
		:class="{ 'focus-visible': focused || focusedWithin }"
	>
		<slot />
	</div>
</template>
