// import type { Ref } from 'vue'
import type { VvInputTextPropsTypes } from './VvInputText'

import { ref, computed, toRefs } from 'vue'
import INPUT from './constants'

// interface useVvInputPasswordProps {
// 	type: Ref<string>
// 	disabled: Ref<boolean>
// 	readonly: Ref<boolean>
// }

/**
 * Funzionalità input password.
 */
export function useInputPassword(props: VvInputTextPropsTypes) {
	const { type, disabled, readonly } = toRefs(props)
	const bHidePassword = ref(true)

	const isPassword = computed(() => type.value === INPUT.TYPES.PASSWORD)
	const isPasswordVisible = computed(() => !bHidePassword.value)
	const passwordButtonIcon = computed(() =>
		isPasswordVisible.value
			? INPUT.TYPES_ICON.PASSWORD_OFF
			: INPUT.TYPES_ICON.PASSWORD_ON
	)

	function toggleShowHidePassword() {
		if (!disabled.value && !readonly.value) {
			bHidePassword.value = !bHidePassword.value
		}
	}

	return {
		isPassword,
		isPasswordVisible,
		passwordButtonIcon,
		toggleShowHidePassword
	}
}
