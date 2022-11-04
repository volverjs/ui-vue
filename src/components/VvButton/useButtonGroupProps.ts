import type { IButtonGroupState } from '../../composables/group/types'

//Composables
import { useInjectedGroupState } from '../../composables/group/useGroupOrLocalState'

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
	const { isInGroup, getGroupOrLocalReadOnlyRef, getGroupOrLocalRef } =
		useInjectedGroupState<IButtonGroupState>(VV_BUTTON_GROUP)

	const modelValue = getGroupOrLocalRef(props, 'modelValue', emit)
	const disabled = getGroupOrLocalReadOnlyRef(props, 'disabled')
	const toggle = getGroupOrLocalReadOnlyRef(props, 'toggle')

	return {
		modelValue,
		disabled,
		toggle,
		isInGroup
	}
}
