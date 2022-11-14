import type { App, VNode } from 'vue'
import type { NotifyOptions } from './types/NotifyOptions'
import type {
	IMessage,
	IAlertMessage,
	IToastMessage
} from '@/composables/notify/types/IMessage'

import { createApp, h, nextTick, ref } from 'vue'
import { NotifyContainer } from './components/NotifyContainer'
import { useNotify } from '@/composables/notify/useNotify'

/**
 * Plugin per la gestione delle notifiche a livello GLOBALE.
 * @description
 * Plugin che mi permette di presentare all'utente delle notifiche. Utilizzabile in qualsiasi punto dell'applicazione.
 */
export default {
	install: (app: App, options: NotifyOptions) => {
		if (!options) throw Error('Option are missing')
		// if (!options.container)
		// 	throw new Error('Notification container is missing')
		if (!options.alert) throw new Error('Alert component is missing')
		if (!options.toast) throw new Error('Toast component is missing')

		const notify = createApp({
			name: 'VvNotifyPlugin',
			setup() {
				const { messages, removeMessage, hideMessage } = useNotify()

				function getAlertPositionKey(msg: IMessage) {
					const { top, bottom } = msg as IAlertMessage
					return {
						top,
						bottom
					}
				}
				function getToastPositionKey(msg: IMessage) {
					const { top, bottom, left, right, center } =
						msg as IToastMessage
					return {
						top,
						bottom,
						left,
						right,
						center
					}
				}
				function closeMessage(msg: IMessage) {
					hideMessage(msg)
					nextTick(() => {
						removeMessage(msg)
					})
				}
				function getMessageNotifyContainer() {
					return options.container || NotifyContainer
				}
				function getMessageTemplateComponent(msg: IMessage) {
					if (msg.type === 'alert' && options.alert)
						return options.alert
					if (msg.type === 'toast' && options.toast)
						return options.toast
					throw Error(
						'Message template is missing. No Alert or Toast component was found'
					)
				}
				function getMessageComponent(msg: IMessage) {
					const template = getMessageTemplateComponent(msg)
					return h(template, {
						...msg,
						onClose: () => closeMessage(msg),
						class: ['my-2']
					})
				}

				return {
					messages,
					getMessageNotifyContainer,
					getAlertPositionKey,
					getToastPositionKey,
					getMessageComponent
				}
			},
			render() {
				const groups = new Map()
				const containers = [] as Array<VNode>
				if (this.messages.length > 0) {
					this.messages.forEach((msg: IMessage) => {
						const key = JSON.stringify(
							msg.type === 'alert'
								? this.getAlertPositionKey(msg)
								: this.getToastPositionKey(msg)
						)
						if (!groups.has(key)) groups.set(key, [])
						groups.set(key, [
							...groups.get(key),
							this.getMessageComponent(msg)
						])
					})

					groups.forEach((value, key) => {
						const gPosition = JSON.parse(key)
						containers.push(
							h(
								this.getMessageNotifyContainer(),
								{
									...gPosition
								},
								() => value
							)
						)
					})
				}

				return containers
			}
		})

		const el = document.createElement('div')
		el.id = 'volver-notify'

		document.body.appendChild(el)
		notify.mount(el)
	}
}
