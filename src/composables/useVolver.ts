import { INJECTION_KEY_VOLVER } from '../constants'

export function useVolver() {
	return inject(INJECTION_KEY_VOLVER)
}
