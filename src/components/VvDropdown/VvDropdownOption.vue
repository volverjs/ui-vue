<script lang="ts">
	export default {
		name: 'VvDropdownOption',
	}
</script>

<script setup lang="ts">
	import { VvDropdownOptionProps } from '.'
	import VvDropdownItem from './VvDropdownItem.vue'

	// props
	const props = defineProps(VvDropdownOptionProps)

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
		:focus-on-hover="focusOnHover"
	>
		<slot />
		<span class="vv-dropdown-option__hint" :title="hintLabel">
			<slot name="hint" v-bind="{ disabled, selected, unselectable }">
				{{ hintLabel }}
			</slot>
		</span>
	</VvDropdownItem>
</template>
