import type { IMessage } from './types/IMessage'
import { ref, computed, unref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const messageQueue = ref<Array<IMessage>>([])
export function useNotify() {
	const isEmpty = computed(() => {
		return messageQueue.value.length === 0
	})

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
