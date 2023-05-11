<script setup lang="ts">
	import { VvTabProps, VvTabEvents } from '@/components/VvTab'
	import type { NavItem } from '@/components/VvNav'
	import VvNav from '@/components/VvNav/VvNav.vue'

	const props = defineProps(VvTabProps)
	const emit = defineEmits(VvTabEvents)
	const { modifiers, items } = toRefs(props)
	const activeTab: Ref<string | null> = ref(null)

	// bem css classes
	const bemCssClasses = useModifiers('vv-tab', modifiers)

	const localItems = computed(() => {
		return items.value.map((item, index) => {
			return {
				...item,
				id: item.id || `tab-item_${index}`,
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
			activeTab.value = item.id!
		}
	}
</script>

<template>
	<div :class="bemCssClasses">
		<VvNav :items="localItems" modifiers="tabs full" @click="onClick" />
		<!-- #region tab content -->
		<article
			v-for="item in localItems"
			:id="item.id"
			:key="item.id"
			:class="{ target: activeTab === item.id }"
			class="vv-tab__panel"
		>
			<slot :name="`${item.id}`" />
		</article>
		<!-- #endregion tab content -->
	</div>
</template>
