import { INJECTION_KEY_ALERT_GROUP } from '../../constants'

/**
 * Injects alert group name
 */
export function useInjectedAlertGroup() {
	return inject(INJECTION_KEY_ALERT_GROUP, {})
}
