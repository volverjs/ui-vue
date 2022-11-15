import type { Component } from 'vue'

export interface INotifyOptions {
	/**
	 * Container per le notifiche.
	 */
	container: INotifyContainerOptions
	/**
	 * Opzioni per la visualizzazione delle alert notifications.
	 */
	alert: INotifyComponentOptions
	/**
	 * Opzioni per la visualizzazione delle toast notifications.
	 */
	toast: INotifyComponentOptions
}

export interface INotifyContainerOptions {
	component: Component
	top?: boolean
	bottom?: boolean
	left?: boolean
	right?: boolean
	center?: boolean
}

export interface INotifyComponentOptions {
	component: Component
	closable: boolean
	autoclose: number
}
