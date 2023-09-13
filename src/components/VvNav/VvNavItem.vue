<script lang="ts">
	export default {
		name: 'VvNavItem',
		inheritAttrs: false,
	}
</script>

<script setup lang="ts">
	import VvAction from '@/components/VvAction/VvAction.vue'
</script>

<template>
	<li class="vv-nav__item" role="presentation">
		<VvAction v-bind="$attrs" class="vv-nav__item-label">
			<slot />
		</VvAction>
	</li>
</template>
