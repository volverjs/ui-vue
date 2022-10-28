<template>
	<article class="vv-card">
		<header v-if="$slots.header || title" class="vv-card__header">
			<slot name="header"></slot>
		</header>
		<slot />
		<div v-if="$slots.content" class="vv-card__content">
			<slot name="content" />
		</div>
		<footer v-if="$slots.footer" class="vv-card__footer">
			<slot name="footer" />
		</footer>
	</article>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { VvCardProps } from './VvCard'

const props = defineProps(VvCardProps)

const cardClass = computed(() => {
    let {....} = props
    useBEM('vv-card', props)
})
</script>
