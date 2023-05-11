<script setup lang="ts">
	defineProps({
		title: String,
	})
</script>

<template>
	<span class="vv-nav__heading-label" aria-hidden="true">
		{{ title }}
	</span>
</template>
