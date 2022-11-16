import type {
	IMessage,
	IMessageOptions,
	MessageType,
	INotify
} from './types/IMessage'
import type { INotifyOptions } from '@/plugins/notify/types/NotifyOptions'
import { ref, inject } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { VV_NOTIFY_PLUGIN } from '@/constants'
import { NotifyOptionsFactory } from './models/MessageOptions'
import ObjectUtilities from '@/utils/ObjectUtilities'

const messageQueue = ref(new Map<string, Array<INotify>>())
export function useNotify() {
	//Recupero delle impostazioni del plugin Notify (se utilizzato)
	const pluginNotifyOptions = inject<INotifyOptions>(VV_NOTIFY_PLUGIN)

	/**
	 * Cerca notifica
	 * @param id
	 */
	function findById(id: string): INotify | null {
		if (!id) return null
		const groupsIter = messageQueue.value.keys()
		let groupIndex = groupsIter.next()
		let notify = null
		while (!notify || !groupIndex.done) {
			const group = messageQueue.value.get(groupIndex.value)
			notify = group?.find((item) => item.id === id)
			groupIndex = groupsIter.next()
		}
		return notify
	}

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

		//Aggiungi al gruppo
		const group = messageQueue.value.get(groupId)
		group?.push(notify)

		return notify
	}

	function remove(notify: string | INotify) {
		const notifyToRemove = ObjectUtilities.isString(notify)
			? findById(notify as string)
			: (notify as INotify)
		const notifyGroupId = notifyToRemove?.options?.groupId as string
		const notifyGroup = notifyToRemove
			? messageQueue.value.get(notifyGroupId)
			: null

		if (notifyToRemove && notifyGroup) {
			const notifyInGroupIndex = notifyGroup.findIndex(
				(m) => m.id === notifyToRemove.id
			)
			notifyGroup.splice(notifyInGroupIndex, 1)
			messageQueue.value.set(notifyGroupId, notifyGroup)
		}
	}

	function clear() {
		messageQueue.value.clear()
	}

	function hide(notify: string | INotify) {
		const notifyToHide = ObjectUtilities.isString(notify)
			? findById(notify as string)
			: (notify as INotify)
		const notifyGroupId = notifyToHide?.options?.groupId as string
		const notifyGroup = notifyToHide
			? messageQueue.value.get(notifyGroupId)
			: null

		if (notifyToHide && notifyGroup) {
			const notifyInGroupIndex = notifyGroup.findIndex(
				(m) => m.id === notifyToHide.id
			)
			notifyGroup[notifyInGroupIndex].visible = false
			messageQueue.value.set(notifyGroupId, notifyGroup)
		}
	}

	return {
		messages: messageQueue,
		show,
		remove,
		hide,
		clear
	}
}
