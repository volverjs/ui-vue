<script setup lang="ts">
	import { VvNavProps, VvNavEvents, type NavItem } from '@/components/VvNav'
	import VvAction from '@/components/VvAction/VvAction.vue'

	const props = defineProps(VvNavProps)
	const emit = defineEmits(VvNavEvents)
	const { modifiers } = toRefs(props)
	const activeItem: Ref<string | null> = ref(null)

	// bem css classes
	const bemCssClasses = useModifiers('vv-nav', modifiers)

	/**
	 * Triggers when the item is clicked.
	 * @private
	 * @event click
	 * @param [NavItem, number] item, id - the clicked item
	 */
	function onClick(item: NavItem, id: string) {
		if (!item.disabled) {
			emit('click', item)
			activeItem.value = id
		}
	}
</script>

<template>
	<nav :class="bemCssClasses">
		<ul class="vv-nav__menu" role="menu" aria-busy="true">
			<li
				v-for="(navItem, index) in items"
				:key="`nav-item_${index}`"
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
						current: activeItem == `nav-item_${index}`,
						disabled: navItem.disabled,
					}"
					class="vv-nav__item-label"
					v-on="navItem.on || {}"
					@click="onClick(navItem, `nav-item_${index}`)"
				>
					{{ navItem.title }}
				</VvAction>
			</li>
		</ul>
	</nav>
</template>
