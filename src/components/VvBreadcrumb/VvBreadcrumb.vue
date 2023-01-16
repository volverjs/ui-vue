<script lang="ts">
export default {
	name: 'VvBreadcrumb'
}
</script>

<script setup lang="ts">
import { useBemModifiers } from '@/composables/useModifiers'
import { VvBreadcrumbProps } from '@/components/VvBreadcrumb'

const props = defineProps(VvBreadcrumbProps)
const { bemCssClasses } = useBemModifiers('vv-breadcrumb', {
	modifiers: props.modifiers
})
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
						index === Number(routes?.length) - 1
				}"
				itemprop="itemListElement"
				itemtype="https://schema.org/ListItem"
				itemscope>
				<component
					:is="route.to ? 'router-link' : route.href ? 'a' : 'span'"
					v-bind="route"
					:class="{
						'vv-breadcrumb__link':
							index < Number(routes?.length) - 1
					}"
					:aria-current="
						index === Number(routes?.length) - 1
							? 'page'
							: undefined
					"
					itemprop="item">
					<slot name="label" v-bind="{ route, index }">
						{{ route.label }}
					</slot>
				</component>
				<meta itemprop="position" :content="`${index + 1}`" />
			</li>
		</ol>
	</nav>
</template>
