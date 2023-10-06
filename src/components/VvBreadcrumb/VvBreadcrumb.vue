<script lang="ts">
	export default {
		name: 'VvBreadcrumb',
	}
</script>

<script setup lang="ts">
	import { useModifiers } from '../../composables/useModifiers'
	import { VvBreadcrumbProps } from '.'
	import VvAction from '../VvAction/VvAction.vue'

	const props = defineProps(VvBreadcrumbProps)
	const { modifiers } = toRefs(props)
	const bemCssClasses = useModifiers('vv-breadcrumb', modifiers)
	const length = computed(() => props.routes?.length ?? 0)

	const isLast = (index: number) => index === length.value - 1
</script>

<template>
	<nav :class="bemCssClasses" aria-label="breadcrumbs">
		<ol class="vv-breadcrumb__list">
			<li
				v-for="({ label, ...route }, index) in routes"
				:key="`${label}-${index}`"
				:class="
					!isLast(index)
						? 'vv-breadcrumb__item'
						: 'vv-breadcrumb__item-active'
				"
				itemprop="itemListElement"
				itemtype="https://schema.org/ListItem"
				itemscope
			>
				<VvAction
					v-bind="route"
					:class="
						!isLast(index)
							? 'vv-breadcrumb__link'
							: 'vv-breadcrumb__label'
					"
					:aria-current="isLast(index) ? 'page' : undefined"
					itemprop="item"
					default-tag="span"
				>
					<!-- @slot Slot for label -->
					<slot name="label" v-bind="{ route, index }">
						{{ label }}
					</slot>
				</VvAction>
				<meta itemprop="position" :content="`${index + 1}`" />
			</li>
		</ol>
	</nav>
</template>
