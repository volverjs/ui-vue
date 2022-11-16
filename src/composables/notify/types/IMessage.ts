export interface IMessageGroup {
	id: string
}

export interface IMessage {
	type: 'alert' | 'toast' | string
	title: string
	message: string
}

export interface IMessageOptions {
	groupId: string
	modifiers?: string | Array<string>
	closable?: boolean
	autoclose?: number
	onClose?: () => void
}

export interface IAlertMessageOptions extends IMessageOptions {
	top?: boolean
	bottom?: boolean
}

export interface IToastMessageOptions extends IMessageOptions {
	top?: boolean
	bottom?: boolean
	left?: boolean
	right?: boolean
	center?: boolean
}

export interface INotify {
	id: string
	visible: boolean
	type: MessageType
	message: IMessage
	options: IMessageOptions
}

export enum MessageType {
	ALERT = 'alert',
	TOAST = 'toast'
}
