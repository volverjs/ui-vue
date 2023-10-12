<script setup lang="ts">
	import { VvNavProps, VvNavEvents } from '@/components/VvNav'
	import VvNavItem from './VvNavItem.vue'

	const props = defineProps(VvNavProps)
	const { modifiers } = toRefs(props)

	const emit = defineEmits(VvNavEvents)
	const onClick = (event: Event) => {
		const target = event.target as HTMLElement
		if (target?.dataset.index) {
			const index = parseInt(target.dataset.index)
			const item = props.items?.[index]
			if (!item || item?.disabled) {
				return
			}
			emit('click', item)
		}
	}

	// bem css classes
	const bemCssClasses = useModifiers('vv-nav', modifiers)
</script>

<template>
	<nav :class="bemCssClasses">
		<ul
			class="vv-nav__menu"
			role="menu"
			aria-busy="true"
			@click.stop="onClick"
		>
			<slot>
				<VvNavItem
					v-for="({ on = {}, data, ...item }, index) in items"
					:key="index"
					:data-index="index"
					v-bind="item"
					v-on="on"
				>
					<slot name="item" v-bind="{ item, data, index }" />
				</VvNavItem>
			</slot>
		</ul>
	</nav>
</template>
