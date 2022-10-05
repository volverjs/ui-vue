<template>
	<button
		class="vv-button"
		:class="[isElementActive && 'active']"
		@click="onClick">
		<slot>{{ label }}</slot>
	</button>
</template>

<script lang="ts">
import { useCurrentElementGroup } from '../../composables/useElementsGroup'
import { VV_BUTTON_GROUP_MANAGER } from '../../composables/keys'
import { computed, toRefs, defineComponent, unref } from 'vue'

export default defineComponent({
	props: {
		label: String
	},
	setup(props: Object, { attrs }) {
		const name: String = (attrs?.name || null) as String
		const { group, groupElementId, isInGroup, isElementActive } =
			useCurrentElementGroup(VV_BUTTON_GROUP_MANAGER, name)

		return {
			group,
			groupElementId,
			isInGroup,
			isElementActive,
			onClick() {
				if (isInGroup.value)
					unref(group)?.setActive(groupElementId.value)
			}
		}
	}
})
</script>

<style></style>
