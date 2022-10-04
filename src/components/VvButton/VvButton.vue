<template>
	<button
		class="vv-button"
		:class="[isActiveInGroup && 'active']"
		@click="onClick">
		<slot>{{ label }}</slot>
	</button>
</template>

<script lang="ts">
import { useElementGroupItem } from '../../composables/useElementsGroup'
import { VV_BUTTON_GROUP_MANAGER } from '../../composables/keys'
import { computed } from '@vue/runtime-core'
import type { IElementsGroup } from '@/composables/types'

export default {
	props: {
		label: String
	},
	setup(props: Object, context: Object) {
		//Check group e registra in automatico????
		const { group, groupElementId } = useElementGroupItem(
			VV_BUTTON_GROUP_MANAGER
		)

		const isActiveInGroup = computed(
			() =>
				group &&
				groupElementId.value ===
					(group as IElementsGroup)?.itemActive.value
		)

		return {
			group,
			groupElementId,
			isActiveInGroup,
			onClick() {
				if (group)
					(group as IElementsGroup).setActive(groupElementId.value)
			}
		}
	}
}
</script>

<style></style>
