<script setup lang="ts">
import { VvAvatarProps } from '@/components/VvAvatar'

const props = defineProps(VvAvatarProps)
const { modifiers, rounded } = toRefs(props)
const hasStyle = computed(() => props.color ? {'background-color': props.color} : {})

// bem css classes
const { bemCssClasses: avatarClass } = useBemModifiers('vv-avatar', {
	modifiers,
	rounded
})

// all css classes
const hasClass = computed(() => {
	const classes = [avatarClass.value, props.cssClass]
	if(props.size) {
		classes.push(`vv-avatar--${props.size}`)
	}
	return classes
})
</script>

<template>
	<span :class="hasClass" :style="hasStyle" :role="imgSrc ? undefined : 'img'" :aria-label="imgSrc ? undefined : 'avatar'">
		<slot>
			<img v-if="imgSrc" :src="imgSrc" alt="avatar" />
		</slot>
    </span>
</template>