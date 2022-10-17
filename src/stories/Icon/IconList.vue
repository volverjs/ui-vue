<template>
	<div class="vv-input-text">
		<label for="search">Search</label>
		<div class="vv-input-text__wrapper">
			<input id="search" v-model="search" type="text" />
		</div>
	</div>
	<div class="vv-icon-list flex gap-16 flex-wrap mt-lg">
		<div
			v-for="iconName in icons"
			:key="iconName"
			class="icon-item flex items-center xl:w-1/6 md:w-1/5 sm:w-1/3 xs:w-full">
			<VvIcon :name="iconName" width="25" class="mr-md" />
			{{ iconName }}
		</div>
	</div>
</template>

<script setup lang="ts">
import VvIcon from '../../components/VvIcon/VvIcon.vue'
import IconsNormal from '../../assets/icons/normal.json'
import { ref, watch, type Ref } from 'vue'

const allIcons = Object.keys(IconsNormal.icons)
const icons: Ref<string[]> = ref(allIcons)
const search = ref('')
watch(search, (newValue) => {
	icons.value = allIcons.filter((icon) => icon.includes(newValue))
})
</script>

<style lang="scss">
@import '@volverjs/style/components/vv-input-text';
</style>
