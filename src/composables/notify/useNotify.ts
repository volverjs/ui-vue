import type {
	IMessage,
	IMessageOptions,
	MessageType,
	INotify
} from './types/IMessage'
import type { INotifyOptions } from '@/plugins/notify/types/NotifyOptions'
import { ref, computed, unref, inject } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { VV_NOTIFY_PLUGIN } from '@/constants'
import { NotifyOptionsFactory } from './models/MessageOptions'

const messageQueue = ref(new Map<string, Array<INotify>>())
export function useNotify() {
	//Recupero delle impostazioni del plugin Notify (se utilizzato)
	const pluginNotifyOptions = inject<INotifyOptions>(VV_NOTIFY_PLUGIN)

	// const isEmpty = computed(() => {
	// 	return messageQueue.value.length === 0
	// })

	function show(type: MessageType, msg: IMessage, options?: IMessageOptions) {
		//Calcolo le opzioni per il messaggio da visualizzare.
		const msgOptions = NotifyOptionsFactory.create(
			type,
			options,
			pluginNotifyOptions
		)
		const groupId = msgOptions.groupId

		//Inizializza il gruppo se non esiste
		if (!messageQueue.value.has(groupId))
			messageQueue.value.set(groupId, [])

		//Crea notifica
		const notify: INotify = {
			id: uuidv4(),
			visible: true,
			type,
			message: msg,
			options: msgOptions
		}

		const group = messageQueue.value.get(groupId)
		group?.push(notify)
	}

	function addMessage(msg: IMessage) {
		if (!msg) throw Error('Message is null or empty')
		if (!msg.id) msg.id = uuidv4()

		unref(messageQueue).push(msg)
		return msg
	}
	function removeMessage(msg: IMessage) {
		if (!msg) throw Error('Message is null or empty')
		if (!msg.id) throw Error('Message id is null or empty')

		const _msgIndexToRemove = unref(messageQueue).findIndex(
			(m) => m.id === msg.id
		)
		if (_msgIndexToRemove > -1) {
			unref(messageQueue).splice(_msgIndexToRemove, 1)
		}

		console.log('Remove_', {
			msg,
			_msgIndexToRemove
		})

		return msg
	}
	function clear() {
		messageQueue.value = []
	}
	function hideMessage(msg: IMessage) {
		if (!msg) throw Error('Message is null or empty')
		if (!msg.id) throw Error('Message id is null or empty')
		const _msgIndexToHide = unref(messageQueue).findIndex(
			(m) => m.id === msg.id
		)
		if (_msgIndexToHide > -1) {
			const updateMessage = unref(messageQueue)[_msgIndexToHide]
			updateMessage.visible = false
			unref(messageQueue).splice(_msgIndexToHide, 1, updateMessage)
		}
	}

	return {
		messages: messageQueue,
		isEmpty,
		addMessage,
		removeMessage,
		hideMessage,
		clear
	}
}
