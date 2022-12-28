import { defineComponent, h } from 'vue'
import VvIcon from '@/components/VvIcon/VvIcon.vue'

export default defineComponent({
	components: {
		VvIcon
	},
	props: {
		disabled: {
			type: Boolean,
			default: false
		},
		label: {
			type: String,
			default: 'Clear'
		},
		icon: {
			type: String,
			default: 'close'
		}
	},
	emits: ['clear'],
	setup(props, { emit }) {
		function onClick(e: Event) {
			e?.stopPropagation()
			if (!props.disabled) {
				emit('clear')
			}
		}

		return {
			onClick
		}
	},
	render() {
		const icon = h(VvIcon, {
			name: this.icon,
			class: 'vv-input-text__action-icon'
		})

		return h(
			'button',
			{
				disabled: this.disabled,
				class: 'vv-input-text__action',
				ariaLabel: this.label,
				type: 'button',
				onClick: this.onClick
			},
			icon
		)
	}
})
