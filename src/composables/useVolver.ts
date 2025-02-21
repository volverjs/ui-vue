import { INJECTION_KEY_VOLVER } from '../constants'

/**
 * Injects volver
 */
export function useVolver() {
    return inject(INJECTION_KEY_VOLVER, undefined)
}
