<script lang="ts">
	export default {
		name: 'VvDropdownOption',
	}
</script>

<script setup lang="ts">
	import VvDropdownItem from '@/components/VvDropdown/VvDropdownItem.vue'
	import {
		DisabledProps,
		ModifiersProps,
		SelectedProps,
		UnselectableProps,
	} from '@/props'

	// props
	const props = defineProps({
		...DisabledProps,
		...SelectedProps,
		...UnselectableProps,
		...ModifiersProps,
		deselectHintLabel: {
			type: String,
		},
		selectHintLabel: {
			type: String,
		},
		selectedHintLabel: {
			type: String,
		},
	})

	// style
	const { modifiers } = toRefs(props)
	const bemCssClasses = useBemModifiers(
		'vv-dropdown-option',
		modifiers,
		computed(() => ({
			disabled: props.disabled,
			selected: props.selected,
			unselectable: props.unselectable && props.selected,
		})),
	)
</script>

<template>
	<VvDropdownItem
		:class="bemCssClasses"
		:tabindex="disabled ? -1 : 0"
		:aria-selected="selected"
		:aria-disabled="disabled"
	>
		<slot />
		<span class="vv-dropdown-option__hint">
			<slot name="hint" v-bind="{ disabled, selected, unselectable }">
				<template v-if="selected">
					{{ unselectable ? deselectHintLabel : selectedHintLabel }}
				</template>
				<template v-else-if="!disabled">
					{{ selectHintLabel }}
				</template>
			</slot>
		</span>
	</VvDropdownItem>
</template>
