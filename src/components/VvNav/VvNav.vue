<script setup lang="ts">
	import { VvNavProps, type NavItem } from '@/components/VvNav'
	import VvAction from '@/components/VvAction/VvAction.vue'

	const props = defineProps(VvNavProps)
	const emit = defineEmits(['click'])
	const { modifiers } = toRefs(props)
	const activeItem: Ref<string | null> = ref(null)

	// bem css classes
	const bemCssClasses = useModifiers('vv-nav', modifiers)

	const isTabs = computed(() => modifiers?.value?.includes('tabs'))

	/**
	 * Triggers when the item is clicked.
	 * @private
	 * @event click
	 * @param [object, number] item, id - the clicked item
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
		<ul class="vv-nav__menu" role="menu">
			<template
				v-for="(navHeading, headingIndex) in items"
				:key="`heading_${headingIndex}`"
			>
				<!-- #region sidebar and aside -->
				<li v-if="!isTabs" class="vv-nav__item" role="presentation">
					<span
						v-if="navHeading.title"
						:id="`sidebar-label-${headingIndex}`"
						class="vv-nav__heading-label"
						aria-hidden="true"
					>
						{{ navHeading.title }}
					</span>
					<ul
						class="vv-nav__menu"
						role="menu"
						:aria-labelledby="`sidebar-label-${headingIndex}`"
					>
						<li
							v-for="(navItem, index) in navHeading.items"
							:key="`${headingIndex}_${index}`"
							class="vv-nav__item"
						>
							<VvAction
								v-bind="{
									disabled: navItem.disabled,
									to: navItem.to,
									href: navItem.href,
									tabindex: index,
								}"
								:class="{
									current:
										activeItem ==
										`${headingIndex}_${index}`,
									disabled: navItem.disabled,
								}"
								class="vv-nav__item-label"
								v-on="navItem.on || {}"
								@click="
									onClick(navItem, `${headingIndex}_${index}`)
								"
							>
								{{ navItem.title }}
							</VvAction>
						</li>
					</ul>
				</li>
				<!-- #endregion sidebar and aside -->
				<!-- #region tabs -->
				<template v-else-if="isTabs">
					<li
						v-for="(navItem, index) in navHeading.items"
						:key="`${headingIndex}_${index}`"
						class="vv-nav__item"
					>
						<VvAction
							v-bind="{
								disabled: navItem.disabled,
								to: navItem.to,
								href: navItem.href,
								tabindex: index,
							}"
							:class="{
								current:
									activeItem == `${headingIndex}_${index}`,
								disabled: navItem.disabled,
							}"
							class="vv-nav__item-label"
							v-on="navItem.on || {}"
							@click="
								onClick(navItem, `${headingIndex}_${index}`)
							"
						>
							{{ navItem.title }}
						</VvAction>
					</li>
				</template>
				<!-- #endregion tabs -->
				<li
					v-if="
						items.length > 1 &&
						headingIndex < items.length - 1 &&
						!isTabs
					"
					class="vv-nav__divider"
					role="separator"
				></li>
			</template>
		</ul>
	</nav>
</template>
