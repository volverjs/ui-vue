import { computed, createApp, h, ref } from 'vue'

import VvAlert from '@/components/VvAlert/VvAlert.vue'
import { useAlert2 } from '@/composables/alert/useAlert'

export default {
	install: (app, options) => {
		const notify = createApp({
			name: 'GigiMi',
			setup() {
				const { visible, hide } = useAlert2()
				return {
					visible,
					hide
				}
			},
			render() {
				return h(VvAlert, {
					fixed: true,
					visible: this.visible,
					title: 'Prova',
					message: 'Ciccio',
					class: 'fixed top-lg inset-x-lg',
					closable: true,
					onClose: this.hide
				})
			}
		})

		const el = document.createElement('div')
		el.id = 'volver-notify'

		document.body.appendChild(el)
		notify.mount(el)
	}
}
