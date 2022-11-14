import { h, defineComponent } from 'vue'

export const NotifyContainer = defineComponent({
	name: 'NotifyContainer',
	props: {
		top: Boolean,
		bottom: Boolean,
		left: Boolean,
		right: Boolean,
		center: Boolean
	},
	setup(props, { slots }) {
		return () =>
			h(
				'div',
				{
					class: {
						fixed: true,
						flex: true,
						'flex-col': true,
						'top-lg': props.top,
						'bottom-lg': props.bottom,
						'right-lg': props.left,
						'left-lg': props.right,
						'inset-x-lg': props.center
					}
				},
				slots.default()
			)
	}
})
