<script setup lang="ts">
	import { VvAvatarGroupProps } from '@/components/VvAvatarGroup'
	import VvAvatar from '@/components/VvAvatar/VvAvatar.vue'

	const props = defineProps(VvAvatarGroupProps)
	const { modifiers, items, toShow, totalItems, avatarModifiers } =
		toRefs(props)

	// bem css classes
	const bemCssClasses = useModifiers('vv-avatar-group', modifiers)

	const avatarItems = computed(() => {
		return items.value.slice(0, toShow.value).map((item) => {
			let modifiers: string[] = []
			let itemModifiers: string[] = []

			if (avatarModifiers?.value) {
				modifiers = Array.isArray(avatarModifiers?.value)
					? avatarModifiers?.value
					: [avatarModifiers?.value]
			}

			if (item.modifiers) {
				itemModifiers = Array.isArray(item.modifiers)
					? item.modifiers
					: [item.modifiers]
			}

			return {
				...item,
				key: item.key || new Date().getTime(),
				modifiers: [...modifiers, ...itemModifiers],
			}
		})
	})
</script>

<template>
	<span :class="bemCssClasses">
		<slot name="default">
			<VvAvatar
				v-for="avatarItem in avatarItems"
				:key="avatarItem.key"
				v-bind="{
					modifiers: avatarItem.modifiers,
					imgSrc: avatarItem.imgSrc,
				}"
			>
				<span v-if="avatarItem.text">{{ avatarItem.text }}</span>
			</VvAvatar>
			<VvAvatar
				v-if="(totalItems || items.length) > toShow"
				:modifiers="`${avatarModifiers} surface bordered`"
				>{{ `+${(totalItems || items.length) - toShow}` }}</VvAvatar
			>
		</slot>
	</span>
</template>
