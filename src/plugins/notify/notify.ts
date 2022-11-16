import type { App } from 'vue'
import type { INotifyOptions } from './types/NotifyOptions'

import { NotifyApp } from './components/NotifyApp'
import { VV_NOTIFY_PLUGIN } from '@/constants'

/**
 * Plugin per la gestione delle notifiche a livello GLOBALE.
 * @description
 * Plugin che mi permette di presentare all'utente delle notifiche. Utilizzabile in qualsiasi punto dell'applicazione.
 */
export default {
	install: (app: App, options: INotifyOptions) => {
		if (!options) throw Error('Option are missing')
		// if (!options.container)
		// 	throw new Error('Notification container is missing')
		if (!options.alert) throw new Error('Alert component is missing')
		if (!options.toast) throw new Error('Toast component is missing')

		const notify = NotifyApp(options)

		const el = document.createElement('div')
		el.id = 'volver-notify'

		document.body.appendChild(el)
		notify.mount(el)

		//Provide opzioni plugin notification a tutti i componenti
		app.provide(VV_NOTIFY_PLUGIN, options)

		//TODO Registrare il plugin a livello globale? Stile Vue2 $notify ??
	}
}
