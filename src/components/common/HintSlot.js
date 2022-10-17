import { h, inject } from 'vue'

export const HintSlot = {
	setup() {
		const content = inject('HINT_CONTENT')
		return {
			content
		}
	},
	render() {
		return h(
			'span',
			{
				style: {
					'white-space': 'pre'
				}
			},
			this.content
		)
	}
}
