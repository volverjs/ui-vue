<script lang="ts">
	export default {
		name: 'VvDropdownOption',
	}
</script>

<script setup lang="ts">
	import VvDropdownItem from './VvDropdownItem.vue'
	import {
		DisabledProps,
		ModifiersProps,
		SelectedProps,
		UnselectableProps,
	} from '../../props'

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
	const bemCssClasses = useModifiers(
		'vv-dropdown-option',
		modifiers,
		computed(() => ({
			disabled: props.disabled,
			selected: props.selected,
			unselectable: props.unselectable && props.selected,
		})),
	)

	// hint
	const hintLabel = computed(() => {
		if (props.selected) {
			return props.unselectable
				? props.deselectHintLabel
				: props.selectedHintLabel
		}
		if (!props.disabled) {
			return props.selectHintLabel
		}
	})
</script>

<template>
	<VvDropdownItem
		:class="bemCssClasses"
		:tabindex="disabled ? -1 : 0"
		:aria-selected="selected"
		:aria-disabled="disabled"
	>
		<slot />
		<span class="vv-dropdown-option__hint" :title="hintLabel">
			<slot name="hint" v-bind="{ disabled, selected, unselectable }">
				{{ hintLabel }}
			</slot>
		</span>
	</VvDropdownItem>
</template>
