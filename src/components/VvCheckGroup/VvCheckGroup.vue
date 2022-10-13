<template>
	<fieldset :class="groupClass">
		<legend v-if="label" v-text="label" />
		<!-- #region options set up -->
		<template v-if="options.length > 0">
			<vv-check
				v-for="(o, oIndex) in options"
				:key="oIndex"
				v-bind="getOptionProps(o, oIndex)" />
		</template>
		<!-- #endregion options set up -->
		<!-- #region default -->
		<slot v-else />
		<!-- #endregion default -->
	</fieldset>
</template>

<script lang="ts">
import type { UseGroupComponentProps } from '@/composables/group/types'
import { defineComponent, toRefs } from 'vue'
import { useGroup } from '../../composables/group/useGroup'
import { VV_CHECK_GROUP } from '../../constants'
import VvCheck from '../../components/VvCheck/VvCheck.vue'

/**
 * VvInputRadioGroup
 */
export default defineComponent({
	components: {
		VvCheck
	},
	props: {
		/**
		 * VModel
		 */
		modelValue: null,
		/**
		 * Radio group label
		 */
		label: { type: String, default: '' },
		/**
		 * Nome da utilizzare per il radio group
		 */
		name: { type: String, default: '', required: true },
		/**
		 * True se disabilitato
		 */
		disabled: { type: Boolean, default: false },
		/**
		 * True se readonly
		 */
		readonly: { type: Boolean, default: false },
		/**
		 * True = show buttons vertically
		 */
		vertical: { type: Boolean, default: false },
		/**
		 * Lista delle radio options
		 */
		options: { type: Array, default: () => [] },
		/**
		 * Se options è un array di oggetti, optionLabel = nome del campo da utilizzare come label oppure una funzione per ricavare la label
		 */
		optionLabel: { type: [String, Function], default: () => 'label' },
		/**
		 * Se options è un array di oggetti, optionValue = nome del campo da utilizzare come value oppure una funzione per ricavare il value
		 */
		optionValue: { type: [String, Function], default: () => 'value' }
	},
	setup(props, { emit }) {
		const { disabled, readonly, modelValue } = toRefs(props)

		const sharedProps: UseGroupComponentProps = {
			disabled,
			readonly,
			modelValue
		}
		const { group } = useGroup(VV_CHECK_GROUP, { props: sharedProps, emit })

		return {
			group
		}
	},
	computed: {
		groupClass() {
			return {
				'vv-input-check-group': true,
				'vv-input-check-group--horizontal': !this.vertical
			}
		}
	},
	methods: {
		getOptionProps(option: any, oIndex: Number) {
			return {
				id: `${this.name}_opt${oIndex}`,
				name: this.name,
				label:
					typeof this.optionLabel === 'function'
						? this.optionLabel(option)
						: option[this.optionLabel],
				value:
					typeof this.optionValue === 'function'
						? this.optionValue(option)
						: option[this.optionValue]
			}
		}
	}
})
</script>

<style lang="scss">
@import '@volverjs/style/components/vv-input-checkbox-group';
</style>
