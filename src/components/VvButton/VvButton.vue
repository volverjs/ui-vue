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
import { useAttrs } from 'vue'
import type { IButtonGroupOptions } from '../../composables/group/types'

import { computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { ButtonIconPosition, ButtonTag } from './VvButton'
import { ButtonGroupState } from '../../composables/group/models'
import { VvButtonProps, VvButtonEvents } from './VvButton'

//Components
import VvIcon from '../VvIcon/VvIcon.vue'

//Composables
import { useGroupOrLocalState } from '../../composables/group/useGroupOrLocalState'

//Constasts
import { VV_BUTTON_GROUP } from '../../constants'

//Props, emits, attrs, slots
const props = defineProps(VvButtonProps)
const emit = defineEmits(VvButtonEvents)
const attrs = useAttrs()

const btnName = attrs?.name || uuidv4()

//Style e Binding
/**
 * Compute component properties
 */
const properties = computed(() => {
	return {
		...linkProps.value,
		'aria-label': props.label || attrs['aria-label'],
		'aria-disabled': isDisabled.value,
		role: 'button',
		class: hasClass.value,
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
		toReturn = isDisabled.value
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
/**
 * @description Select the tag type in based on the props before.
 * @returns {string} The type of component
 */
const isComponent = computed(() => {
	switch (true) {
		case isDisabled.value:
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
 * @description Define css classes.
 * @returns {string} The classes
 */
const hasClass = computed((): Array<string | object> => {
	return [
		'vv-button',
		hasVariant.value,
		hasIconPosition.value,
		{
			'vv-button--active': props.active || isSelected.value,
			'vv-button--block': props.block,
			'vv-button--rounded': props.rounded,
			'vv-button--full-bleed': props.fullBleed,
			'vv-button--disabled': isDisabled.value
		}
	]
})
/**
 * @description Returns icon position.
 * @returns {string} The class
 */
const hasIconPosition = computed(() => {
	return {
		'vv-button--reverse': props.iconPosition === ButtonIconPosition.right,
		'vv-button--column vv-button--reverse':
			props.iconPosition === ButtonIconPosition.bottom,
		'vv-button--column': props.iconPosition === ButtonIconPosition.top,
		'vv-button--icon-only': props.icon && !props.label
	}
})
/**
 * @description Returns button variants.
 * @returns {string} The class
 */
const hasVariant = computed(() => {
	return props.variant ? `vv-button--${props.variant}` : ''
})

//GROUP
// Define reactive props
const buttonGroupOptions: IButtonGroupOptions = {
	modelValue: btnName,
	disabled: props.disabled
}
// Create groupState instance
const groupState = new ButtonGroupState(buttonGroupOptions)
// Use group composable to inject the provided group
const {
	// group,
	modelValue,
	// isInGroup,
	isDisabled,
	isToggleEnabled,
	checkIsSelected
} = useGroupOrLocalState(VV_BUTTON_GROUP, groupState)
const isSelected = computed(
	() => isToggleEnabled.value && checkIsSelected(btnName)
)

//Methods
function onBtnClick() {
	modelValue.value = btnName
	emit('update:modelValue', modelValue.value)
}
</script>
