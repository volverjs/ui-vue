//Composables
import { useInjectedGroupState } from '@/composables/group/useGroupOrLocalState'

//Constasts
import { VV_BUTTON_GROUP } from '../../constants'

/**
 * Estreae tutte le prop del componente VvButton che possono essere
 * "sovrascritte" quando il buttone si trova in un gruppo.
 */
export function toGroupButtonRefs<T extends object>(
	props: T,
	emit: (event: any, ...args: any[]) => void
) {
	const { isInGroup, useGroupOrLocalReadOnlyRef, useGroupOrLocalRef } =
		useInjectedGroupState(VV_BUTTON_GROUP)

	const modelValue = useGroupOrLocalRef(props, 'modelValue', emit)
	const disabled = useGroupOrLocalReadOnlyRef(props, 'disabled')
	const toggle = useGroupOrLocalReadOnlyRef(props, 'toggle')

	return {
		modelValue,
		disabled,
		toggle,
		isInGroup
	}
}
