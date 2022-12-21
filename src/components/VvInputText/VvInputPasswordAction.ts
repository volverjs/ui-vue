import { defineComponent, ref, computed, h } from 'vue'
import { TYPES_ICON } from '@/components/VvInputText'
import VvIcon from '@/components/VvIcon/VvIcon.vue'

export default defineComponent({
	components: {
		VvIcon
	},
	props: {
		disabled: Boolean
	},
	setup(props, { emit }) {
		const active = ref(false)
		const activeIcon = computed(() =>
			active.value ? TYPES_ICON.PASSWORD_OFF : TYPES_ICON.PASSWORD_ON
		)

		function onClick() {
			if (!props.disabled) {
				active.value = !active.value
				emit(
					active.value ? 'action-password-on' : 'action-password-off'
				)
			}
		}

		return {
			activeIcon,
			onClick
		}
	},
	render() {
		const icon = h(VvIcon, { name: this.activeIcon })

		return h(
			'button',
			{
				disabled: this.disabled,
				class: ['vv-input-text__action'],
				onClick: this.onClick
			},
			icon
		)
	}
})
