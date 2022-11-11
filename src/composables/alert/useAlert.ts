import { inject, ref } from 'vue'

export function useAlert() {
	const show = inject('volver-notify')
	return {
		show
	}
}

const visible = ref(false)
export function useAlert2() {
	const show = () => {
		visible.value = true
	}
	const hide = () => {
		visible.value = false
	}

	return {
		visible,
		show,
		hide
	}
}
