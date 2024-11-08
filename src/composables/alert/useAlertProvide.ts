import type { Ref } from 'vue'
import { INJECTION_KEY_ALERT_GROUP } from '@/constants'
import mitt from 'mitt'

/**
 * Share the alert group name with all its children.
 * @param {Ref<string | undefined>} name the alert group name
 */
export function useAlertProvideGroup({
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
