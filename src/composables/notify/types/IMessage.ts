export interface IMessage {
	id?: string
	type: 'alert' | 'toast' | string
	title: string
	message: string
	modifiers: string | Array<string>
	closable: boolean
	autoclose: number
	visible: boolean
	onClose: () => void
}

export interface IAlertMessage extends IMessage {
	type: 'alert'
	top?: boolean
	bottom?: boolean
}

export interface IToastMessage extends IMessage {
	type: 'toast'
	top?: boolean
	bottom?: boolean
	left?: boolean
	right?: boolean
	center?: boolean
}
