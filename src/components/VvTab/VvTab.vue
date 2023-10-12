<script setup lang="ts">
	import { VvTabProps, VvTabEvents } from '@/components/VvTab'
	import VvNav from '@/components/VvNav/VvNav.vue'
	import type { NavItemTab } from '@/types/nav'

	const props = defineProps(VvTabProps)
	const emit = defineEmits(VvTabEvents)
	const { modifiers, items } = toRefs(props)
	const tabKeys = computed(() => {
		return items.value.reduce<string[]>((acc, item) => {
			if (item.tab) {
				acc.push(item.tab)
			}
			return acc
		}, [])
	})
	const localModelValue = ref<string | undefined>()
	const activeTabKey = computed({
		get: () => {
			return (
				props.modelValue || localModelValue.value || tabKeys.value?.[0]
			)
		},
		set: (newValue) => {
			localModelValue.value = newValue
			emit('update:modelValue', newValue)
		},
	})
	const hasNavModifiers = computed(() => {
		return [
			'tabs',
			...(Array.isArray(props.navModifiers)
				? props.navModifiers
				: props.navModifiers?.split(' ') ?? []),
		]
	})
	const onNavClick = (item: NavItemTab) => {
		if (item.tab) {
			activeTabKey.value = item.tab
		}
	}
	const navItems = computed(() =>
		props.items.map((item) => ({
			current: item.tab === activeTabKey.value,
			...item,
		})),
	)

	// bem css classes
	const bemCssClasses = useModifiers('vv-tab', modifiers)
</script>

<template>
	<div :class="bemCssClasses">
		<!-- #region nav -->
		<VvNav
			v-bind="{
				items: navItems,
				modifiers: hasNavModifiers,
			}"
			@click="onNavClick"
		>
			<template #item="{ item, data, index }">
				<slot name="nav-item" v-bind="{ item, data, index }" />
			</template>
		</VvNav>
		<!-- #endregion -->

		<!-- #region panels -->
		<template v-for="(item, index) in items" :key="index">
			<article
				v-if="item.tab"
				:class="{ target: activeTabKey === item.tab }"
				class="vv-tab__panel"
			>
				<slot :name="`panel::${item.tab}`" />
			</article>
		</template>
		<!-- #endregion -->
	</div>
</template>
