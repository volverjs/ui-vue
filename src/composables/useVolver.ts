import { INJECTION_KEY_VOLVER } from '../constants'
import type { VolverInterface } from '../Volver'

export function useVolver() {
	return inject<VolverInterface>(INJECTION_KEY_VOLVER)
}
