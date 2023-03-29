<script setup lang="ts">
	import { VvAvatarProps } from '@/components/VvAvatar'

	const props = defineProps(VvAvatarProps)
	const { modifiers } = toRefs(props)

	// bem css classes
	const bemCssClasses = useModifiers('vv-avatar', modifiers)
</script>

<template>
	<span
		:class="bemCssClasses"
		:role="imgSrc ? undefined : 'img'"
		:aria-label="imgSrc ? undefined : 'avatar'"
	>
		<slot name="default">
			<img v-if="imgSrc" :src="imgSrc" alt="avatar" />
		</slot>
	</span>
</template>
