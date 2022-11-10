<template>
	<!-- #region component: "button" | "a" | "router-link" | "nuxt-link" -->
	<component
		v-bind="properties"
		:is="isComponent"
		@click.passive="onBtnClick">
		<!-- @slot default to replace all button content -->
		<slot>
			<!-- #region loading -->
			<template v-if="loading">
				<slot name="loading">
					<vv-icon
						v-if="loadingIcon"
						class="vv-button__loading-icon"
						:name="loadingIcon" />
					<span v-if="loadingLabel" class="vv-button__label">
						{{ loadingLabel }}
					</span>
				</slot>
			</template>
			<!-- #endregion loading -->
			<!-- #region button -->
			<template v-else>
				<!-- @slot before -->
				<slot name="before" />
				<!-- #region icon -->
				<template v-if="icon">
					<vv-icon class="vv-button__icon" :name="icon" />
				</template>
				<!-- #endregion icon -->
				<!-- #region label  -->
				<span v-if="label" class="vv-button__label">
					<!-- @slot Use this slot for button label -->
					<slot name="label">
						{{ label }}
					</slot>
				</span>
				<!-- #endregion label  -->
				<!-- @slot after -->
				<slot name="after" />
			</template>
			<!-- #endregion button -->
		</slot>
	</component>
	<!-- #endregion component: button | a | router-link | nuxt-link -->
</template>

<script setup lang="ts">
import { useAttrs, useSlots } from 'vue'

import { computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { ButtonIconPosition, ButtonTag } from './VvButton'
import { VvButtonProps } from './VvButton'
import ObjectUtilities from '@/utils/ObjectUtilities'

//Components
import VvIcon from '@/components/VvIcon/VvIcon.vue'

//Composables
import { useBemModifiers } from '@/composables/useModifiers'
import { toButtonRefs } from './useButtonGroupProps'

//Props, emits, attrs, slots
const props = defineProps(VvButtonProps)
const attrs = useAttrs()
const slots = useSlots()

//Data
const btnName = attrs?.name || uuidv4()
const {
	modifiers,
	action,
	actionQuiet,
	block,
	rounded,
	fullBleed,
	iconPosition,
	icon,
	label,
	modelValue,
	disabled,
	toggle,
	isInGroup
} = toButtonRefs(props)

/**
 * @description Select the tag type in based on the props before.
 * @returns {string} The type of component
 */
const isComponent = computed(() => {
	switch (true) {
		case disabled.value:
			return ButtonTag.button
		case props.to !== undefined:
			return ButtonTag.routerLink
		case props.href !== undefined:
			return ButtonTag.a
		default:
			return ButtonTag.button
	}
})

/**
 * Stato active del pulsante.
 * Se in un button group toggle, forza l'active in base al valore selezionato
 */
const active = computed(() => {
	if (!toggle.value) return props.active

	return Array.isArray(modelValue.value)
		? ObjectUtilities.contains(btnName, modelValue.value)
		: ObjectUtilities.equals(btnName, modelValue.value)
})

/**
 * Selected button state
 * If on button "toggle" and "action" GROUP force the selected state
 */
const selected = computed(() => {
	if (!toggle.value) return props.selected

	return Array.isArray(modelValue.value)
		? ObjectUtilities.contains(btnName, modelValue.value)
		: ObjectUtilities.equals(btnName, modelValue.value)
})

//Styles & bindings
const { bemCssClasses: btnClass } = useBemModifiers('vv-button', {
	modifiers,
	active,
	action,
	actionQuiet,
	selected,
	block,
	rounded,
	fullBleed,
	disabled,
	reverse: computed(() =>
		[ButtonIconPosition.right, ButtonIconPosition.bottom].includes(
			iconPosition.value
		)
	),
	column: computed(() =>
		[ButtonIconPosition.top, ButtonIconPosition.bottom].includes(
			iconPosition.value
		)
	),
	iconOnly: computed(() => icon?.value && !label?.value)
})
/**
 * Compute component properties
 */
const properties = computed(() => {
	return {
		...linkProps.value,
		'aria-label': props.label || attrs['aria-label'],
		'aria-disabled': disabled.value,
		role: 'button',
		class: btnClass.value,
		to: props.to
	}
})
/**
 * Compute link props (target, href)
 */
const linkProps = computed(() => {
	const isLink = isComponent.value === ButtonTag.a
	let toReturn = {}
	if (isLink) {
		toReturn = disabled.value
			? {
					href: 'javascript:;'
			  }
			: {
					target: props.target,
					href: props.href
			  }
	}
	return toReturn
})

//Methods
function onBtnClick() {
	// set group modelValue
	if (isInGroup.value) {
		modelValue.value = btnName
	}
}
</script>
