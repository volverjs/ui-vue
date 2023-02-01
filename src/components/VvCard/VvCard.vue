<script lang="ts">
	export default {
		name: 'VvCard',
	}
</script>

<script setup lang="ts">
	import { VvCardProps } from '@/components/VvCard'

	// props and attrs
	const props = defineProps(VvCardProps)

	// styles
	const { modifiers } = toRefs(props)
	const bemCssClasses = useBemModifiers('vv-card', modifiers)
</script>

<template>
	<article :class="bemCssClasses">
		<header v-if="$slots.header || title" class="vv-card__header">
			<!-- @slot Title slot -->
			<slot name="header">
				{{ title }}
			</slot>
		</header>
		<!-- @slot Default slot -->
		<slot />
		<div v-if="$slots.content" class="vv-card__content">
			<!-- @slot Content slot -->
			<slot name="content" />
		</div>
		<footer v-if="$slots.footer" class="vv-card__footer">
			<!-- @slot Footer slot -->
			<slot name="footer" />
		</footer>
	</article>
</template>
