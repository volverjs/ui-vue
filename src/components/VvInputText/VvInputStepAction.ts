import { defineComponent, h } from 'vue'
import VvIcon from '@/components/VvIcon/VvIcon.vue'

export default defineComponent({
	components: {
		VvIcon
	},
	props: {
		disabled: Boolean,
		mode: {
			type: String,
			validator: (v: string) => ['up', 'down'].includes(v),
			default: 'up'
		}
	},
	setup(props, { emit }) {
		function onClick() {
			if (!props.disabled) {
				emit(
					props.mode === 'up' ? 'action-step-up' : 'action-step-down'
				)
			}
		}

		return {
			onClick
		}
	},
	render() {
		return h('button', {
			class: [
				'vv-input-text__action-chevron',
				this.mode === 'up' && 'vv-input-text__action-chevron-up'
			],
			disabled: this.disabled,
			onClick: this.onClick
		})
	}
})
