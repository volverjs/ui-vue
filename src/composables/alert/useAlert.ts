import {
	DEFAULT_ALERT_AUTO_CLOSE,
	DEFAULT_ALERT_DISMISSABLE,
	DEFAULT_ALERT_GROUP,
	DEFAULT_ALERT_MODIFIERS,
	DEFAULT_ALERT_INFO_ICON,
	DefaultAlertIconMap,
} from '@/constants'
import type { Alert, AlertModifier } from '@/types/alert'

type AlertInGroup = Alert & { timestamp: number; group: string }

const groups = reactive(
	new Map<string, Map<string, AlertInGroup>>([
		[DEFAULT_ALERT_GROUP, new Map<string, AlertInGroup>()],
	]),
)

/**
 * @description Composable to access alert groups, alerts and functions to add, remove and get alerts by group.
 * @example
 *  const { groups, alerts, addAlert, removeAlert, getAlerts } = useAlert()
 *  addAlert({
 *      title: 'Success!',
 *      modifiers: 'success',
 *  })
 *
 *  `<vv-alert-group :items="alerts" :onClose="removeAlert" />`
 *
 *  @returns  {
 *      alerts: ComputedRef<Alert[]> reactive list of alerts default group,
 *      groups: ReactiveRef<Map<string, Map<string, Alert>>>,
 *      addAlert: Function to add alert,
 *      removeAlert: Function to remove alert,
 *      getAlerts: Function to get alerts by group
 *  }
 */
export const useAlert = () => {
	const addAlert = (
		{
			id = crypto.randomUUID(),
			group = DEFAULT_ALERT_GROUP,
			title,
			icon = DEFAULT_ALERT_INFO_ICON,
			content,
			footer,
			modifiers = DEFAULT_ALERT_MODIFIERS,
			dismissable = DEFAULT_ALERT_DISMISSABLE,
			autoClose = DEFAULT_ALERT_AUTO_CLOSE,
			timestamp = Date.now(),
		} = {} as Partial<AlertInGroup>,
	) => {
		if (!groups.has(group)) {
			groups.set(group, new Map<string, AlertInGroup>())
		}
		const groupMap = groups.get(group)
		const normalizedModifiers =
			typeof modifiers === 'string' ? modifiers.split(' ') : modifiers

		if (!icon) {
			const alertModifier = normalizedModifiers.find((modifier) =>
				DefaultAlertIconMap.has(modifier as AlertModifier),
			) as AlertModifier | undefined

			if (alertModifier) {
				icon = DefaultAlertIconMap.get(alertModifier) as string
			}
		}
		groupMap?.set(id.toString(), {
			id,
			group,
			title,
			icon,
			content,
			footer,
			modifiers,
			dismissable,
			autoClose,
			timestamp,
		})
	}

	const removeAlert = (id: string | number, group = DEFAULT_ALERT_GROUP) => {
		const groupMap = groups.get(group)
		groupMap?.delete(id.toString())
	}

	const getAlerts = (group = DEFAULT_ALERT_GROUP) => {
		return computed(() => {
			const groupMap = groups.get(group)
			return groupMap && groupMap instanceof Map
				? Array.from(groupMap?.values()).sort(
						(a, b) => a.timestamp - b.timestamp,
					)
				: []
		})
	}

	return {
		groups,
		alerts: getAlerts(),
		addAlert,
		removeAlert,
		getAlerts,
	}
}
