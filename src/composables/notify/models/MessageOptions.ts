import type {
	INotifyOptions,
	INotifyComponentOptions
} from '@/plugins/notify/types/NotifyOptions'
import {
	MessageType,
	type IAlertMessageOptions,
	type IMessageOptions,
	type IToastMessageOptions
} from '../types/IMessage'

import ObjectUtilities from '@/utils/ObjectUtilities'

const groupPositionKey = ({
	top,
	bottom,
	right,
	left,
	center
}: {
	[k: string]: boolean
}) => {
	let key = ''
	if (top) key += '_TOP'
	if (bottom) key += '_BOTTOM'
	if (right) key += '_RIGHT'
	if (left) key += '_LEFT'
	if (center) key += '_CENTER'
	return key
}

class BaseNotifyOptions {
	#groupId?: string
	modifiers?: string | Array<string>
	closable?: boolean
	autoclose?: number
	onClose?: () => void

	constructor(
		options: IMessageOptions,
		pluginNotifyOptions?: INotifyComponentOptions
	) {
		this.#groupId = options.groupId
		this.modifiers = options.modifiers || []
		this.onClose = options.onClose

		this.closable = ObjectUtilities.isNotEmpty(options.closable)
			? options.closable
			: pluginNotifyOptions?.closable
		this.autoclose = ObjectUtilities.isNotEmpty(options.autoclose)
			? options.autoclose
			: pluginNotifyOptions?.autoclose
	}
}

export class AlertMessageOptions
	extends BaseNotifyOptions
	implements IAlertMessageOptions
{
	top: boolean
	bottom: boolean

	constructor(
		options: IAlertMessageOptions,
		pluginNotifyOptions?: INotifyComponentOptions
	) {
		super(options, pluginNotifyOptions)

		this.top = options.top || false
		this.bottom = options.bottom || false
	}

	get groupId(): string {
		return (
			this.groupId ||
			groupPositionKey({
				top: this.top,
				bottom: this.bottom
			})
		)
	}
}

export class ToastMessageOptions
	extends BaseNotifyOptions
	implements IToastMessageOptions
{
	top: boolean
	bottom: boolean
	left: boolean
	right: boolean
	center: boolean

	constructor(
		options: IToastMessageOptions,
		pluginNotifyOptions?: INotifyComponentOptions
	) {
		super(options, pluginNotifyOptions)

		this.top = options.top || false
		this.bottom = options.bottom || false
		this.left = options.left || false
		this.right = options.right || false
		this.center = options.center || false
	}

	get groupId(): string {
		return (
			this.groupId ||
			groupPositionKey({
				top: this.top,
				bottom: this.bottom,
				left: this.left,
				right: this.right,
				center: this.center
			})
		)
	}
}

export const NotifyOptionsFactory = {
	create(
		type: MessageType,
		options?: IMessageOptions,
		globalNotification?: INotifyOptions
	) {
		switch (type) {
			case MessageType.ALERT: {
				return new AlertMessageOptions(
					options || {},
					globalNotification?.alert
				)
			}
			case MessageType.TOAST: {
				return new ToastMessageOptions(
					options || {},
					globalNotification?.toast
				)
			}
			default:
				throw Error(`Cannot create options for ${type} notification`)
		}
	}
}
