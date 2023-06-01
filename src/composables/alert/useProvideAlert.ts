import type { Ref } from 'vue'
import mitt from 'mitt'
import { INJECTION_KEY_ALERT_GROUP } from '@/constants'

/**
 * Share the alert group name with all its children.
 * @param {Ref<string | undefined>} name the alert group name
 */
export function useProvideAlertGroup({
	name,
}: {
	name: Ref<string | undefined>
}) {
	const bus = mitt<{
		close: string
	}>()
	provide(INJECTION_KEY_ALERT_GROUP, {
		name,
		bus,
	})

	return bus
}
