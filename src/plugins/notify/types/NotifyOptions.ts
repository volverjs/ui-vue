import type { Component } from 'vue'

export interface NotifyOptions {
	/**
	 * Container per le notifiche.
	 */
	container: Component
	/**
	 * Componente per la visualizzazione degli alert
	 */
	alert: Component
	/**
	 * Componente per la visualizzazione dei toast.
	 */
	toast: Component
}
