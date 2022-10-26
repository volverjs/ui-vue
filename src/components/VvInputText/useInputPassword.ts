import type { Ref } from 'vue'
import { ref, computed } from 'vue'
import INPUT from './constants'

interface useVvInputPasswordProps {
	type: Ref<string>
	disabled: Ref<boolean>
	readonly: Ref<boolean>
}

/**
 * Funzionalità input password.
 */
export function useInputPassword(props: useVvInputPasswordProps) {
	const { type, disabled, readonly } = props
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
