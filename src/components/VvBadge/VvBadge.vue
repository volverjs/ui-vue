<template>
	<span class="vv-badge" :class="hasClass" role="status">{{ value }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
	value?: string | number
	color?: string
}>()

const hasClass = computed(() => (props.color ? `vv-badge--${props.color}` : ''))
</script>

<style lang="scss">
@import '@volverjs/style/components/vv-badge';
</style>
