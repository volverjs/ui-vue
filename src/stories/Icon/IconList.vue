<template>
	<div class="vv-input-text">
		<div class="vv-input-text__wrapper">
			<input v-model="search" type="search" placeholder="Search.." />
		</div>
	</div>
	<div class="grid grid-cols-5 gap-16 mt-lg">
		<div
			v-for="iconName in icons"
			:key="iconName"
			class="flex items-center">
			<VvIcon :name="iconName" width="25" class="mr-md" />
			{{ iconName }}
		</div>
	</div>
</template>

<script setup lang="ts">
import VvIcon from '@/components/VvIcon/VvIcon.vue'
import IconsNormal from '@/assets/icons/normal.json'
import { ref, watch, type Ref } from 'vue'

const allIcons = Object.keys(IconsNormal.icons)
const icons: Ref<string[]> = ref(allIcons)
const search = ref('')
watch(search, (newValue) => {
	icons.value = allIcons.filter((icon) => icon.includes(newValue))
})
</script>

<style lang="scss">
@import '@volverjs/style/scss/components/vv-input-text';
</style>
