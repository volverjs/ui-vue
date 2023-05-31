<script setup lang="ts">
	import { VvNavProps, VvNavEvents, type NavItem } from '@/components/VvNav'
	import VvAction from '@/components/VvAction/VvAction.vue'

	const props = defineProps(VvNavProps)
	const emit = defineEmits(VvNavEvents)
	const { modifiers, items } = toRefs(props)
	const activeItem: Ref<string | null> = ref(null)

	// bem css classes
	const bemCssClasses = useModifiers('vv-nav', modifiers)

	const localItems = computed(() => {
		return items.value.map((item, index) => {
			return {
				...item,
				id: item.id || `nav-item_${index}`,
			}
		})
	})

	/**
	 * Triggers when the item is clicked.
	 * @private
	 * @event click
	 * @param [NavItem, string] item - the clicked item
	 */
	function onClick(item: NavItem) {
		if (!item.disabled) {
			emit('click', item)
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			activeItem.value = item.id!
		}
	}
</script>

<template>
	<nav :class="bemCssClasses">
		<ul class="vv-nav__menu" role="menu" aria-busy="true">
			<li
				v-for="navItem in localItems"
				:key="navItem.id"
				class="vv-nav__item"
				role="presentation"
			>
				<VvAction
					v-bind="{
						disabled: navItem.disabled,
						to: navItem.to,
						href: navItem.href,
						tabindex: 0,
					}"
					:class="{
						current: activeItem == navItem.id,
						disabled: navItem.disabled,
					}"
					class="vv-nav__item-label"
					v-on="navItem.on"
					@click="onClick(navItem)"
				>
					{{ navItem.title }}
				</VvAction>
			</li>
		</ul>
	</nav>
</template>
