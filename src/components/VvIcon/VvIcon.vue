<template>
	<Icon :icon="name" />
</template>

<script lang="ts">
import { Icon } from '@iconify/vue'
import { defineComponent } from 'vue'

export default defineComponent({
	components: { Icon },
	props: {
		name: String
	}
})
</script>
