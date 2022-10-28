<template>
	<span class="vv-badge" :class="hasClass" role="status">{{ value }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { VvBadgeProps } from './VvBadge'

const props = defineProps(VvBadgeProps)

const hasClass = computed(() => (props.color ? `vv-badge--${props.color}` : ''))
</script>
