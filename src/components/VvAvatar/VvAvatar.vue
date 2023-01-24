<script setup lang="ts">
import { VvAvatarProps } from '@/components/VvAvatar'

const props = defineProps(VvAvatarProps)
const { modifiers } = toRefs(props)

// bem css classes
const { bemCssClasses } = useBemModifiers('vv-avatar', {
	modifiers
})
</script>

<template>
	<span :class="bemCssClasses" :role="imgSrc ? undefined : 'img'" :aria-label="imgSrc ? undefined : 'avatar'">
		<div class="vv-avatar--wrapper">
			<slot name="content">
				<img v-if="imgSrc" :src="imgSrc" alt="avatar" />
			</slot>
		</div>
		<slot name="default" />
    </span>
</template>