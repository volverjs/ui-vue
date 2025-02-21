import { INJECTION_KEY_ALERT_GROUP } from '../../constants'

/**
 * Injects alert group
 */
export function useInjectedAlertGroup() {
    return inject(INJECTION_KEY_ALERT_GROUP, {})
}
