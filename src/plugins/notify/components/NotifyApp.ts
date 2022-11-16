import type { VNode } from 'vue'
import type { INotifyOptions } from '../types/NotifyOptions'

import { createApp, h, nextTick } from 'vue'
import { NotifyContainer } from '../components/NotifyContainer'
import { useNotify } from '@/composables/notify/useNotify'
import { type INotify, MessageType } from '@/composables/notify/types/IMessage'

const isGlobalPositionedGroup = (groupId: string) =>
	groupId.startsWith('TOP_') || groupId.startsWith('BOTTOM_')

export const NotifyApp = (options: INotifyOptions) =>
	createApp({
		name: 'VvNotifyPlugin',
		setup() {
			const { messages, remove, hide } = useNotify()

			function getMessageNotifyContainer() {
				return options.container || NotifyContainer
			}

			function getMessageTemplateComponent(notify: INotify) {
				if (notify.type === MessageType.ALERT && options.alert)
					return options.alert.component
				if (notify.type === MessageType.TOAST && options.toast)
					return options.toast.component
				throw Error(
					'Message template is missing. No Alert or Toast component was found'
				)
			}

			function getMessageComponent(notify: INotify) {
				const template = getMessageTemplateComponent(notify)
				return h(template, {
					...notify.message,
					...notify.options,
					visible: notify.visible,
					onClose: () => closeNotify(notify),
					class: ['my-2']
				})
			}

			function closeNotify(notify: INotify) {
				hide(notify)
				nextTick(() => {
					remove(notify)
				})
			}

			return {
				messages,
				getMessageNotifyContainer,
				getMessageComponent
			}
		},
		render() {
			const containers = [] as Array<VNode>
			const groupIterator = this.messages.keys()
			let groupIndex = groupIterator.next()
			while (!groupIndex.done) {
				const notifies = isGlobalPositionedGroup(groupIndex.value)
					? this.messages.get(groupIndex.value)
					: []
				if (notifies.length > 0) {
					const _content = notifies.map((n: INotify) =>
						this.getMessageComponent(n)
					)
					containers.push(
						h(
							this.getMessageNotifyContainer(),
							{
								top: notifies[0].options?.top || false,
								bottom: notifies[0].options?.bottom || false,
								left: notifies[0].options?.left || false,
								right: notifies[0].options?.right || false,
								center: notifies[0].options?.center || false
							},
							() => _content
						)
					)
				}
				groupIndex = groupIterator.next()
			}
			return containers
		}
	})
