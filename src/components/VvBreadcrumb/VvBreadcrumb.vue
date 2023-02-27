<script lang="ts">
	export default {
		name: 'VvBreadcrumb',
	}
</script>

<script setup lang="ts">
	import { useModifiers } from '../../composables/useModifiers'
	import { VvBreadcrumbProps } from '.'

	const props = defineProps(VvBreadcrumbProps)
	const { modifiers } = toRefs(props)
	const bemCssClasses = useModifiers('vv-breadcrumb', modifiers)
</script>

<template>
	<nav :class="bemCssClasses" aria-label="breadcrumbs">
		<ol class="vv-breadcrumb__list">
			<li
				v-for="(route, index) in routes"
				:key="`${route.label}-${index}`"
				:class="{
					'vv-breadcrumb__item': index < Number(routes?.length) - 1,
					'vv-breadcrumb__item-active':
						index === Number(routes?.length) - 1,
				}"
				itemprop="itemListElement"
				itemtype="https://schema.org/ListItem"
				itemscope
			>
				<Component
					:is="route.to ? 'router-link' : route.href ? 'a' : 'span'"
					v-bind="route"
					:class="{
						'vv-breadcrumb__link':
							index < Number(routes?.length) - 1,
					}"
					:aria-current="
						index === Number(routes?.length) - 1
							? 'page'
							: undefined
					"
					itemprop="item"
				>
					<!-- @slot Slot for label -->
					<slot name="label" v-bind="{ route, index }">
						{{ route.label }}
					</slot>
				</Component>
				<meta itemprop="position" :content="`${index + 1}`" />
			</li>
		</ol>
	</nav>
</template>
