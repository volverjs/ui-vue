import { computed, defineComponent, h } from 'vue'
import VvIcon from '@/components/VvIcon/VvIcon.vue'

export default defineComponent({
	components: {
		VvIcon,
	},
	props: {
		disabled: {
			type: Boolean,
			default: false,
		},
		label: {
			type: String,
		},
		mode: {
			type: String,
			validator: (v: string) => ['up', 'down'].includes(v),
			default: 'up',
		},
	},
	emits: ['step-up', 'step-down'],
	setup(props, { emit }) {
		const isUp = computed(() => props.mode === 'up')

		const onClick = (e: Event) => {
			e?.stopPropagation()
			if (!props.disabled) {
				emit(isUp.value ? 'step-up' : 'step-down')
			}
		}

		return {
			isUp,
			onClick,
		}
	},
	render() {
		return h('button', {
			class: [
				'vv-input-text__action-chevron',
				this.isUp && 'vv-input-text__action-chevron-up',
			],
			disabled: this.disabled,
			ariaLabel: this.label,
			onClick: this.onClick,
		})
	},
})
