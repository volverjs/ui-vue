import { getIconsCollection } from '../src/assets/icons/index'
import { addCollection } from '@iconify/vue'

// https://vuejs.org/guide/typescript/options-api.html#augmenting-global-properties
declare module 'vue' {
	interface ComponentCustomProperties {
		$ds: typeof DesignSystem
	}
}

interface IDesignSystem {
	defaultProvider: string
}

export default class DesignSystem implements IDesignSystem {
	static defaultProvider: string | undefined

	constructor() {
		this.defaultProvider = 'vv-provider'
	}

	public defaultProvider: string

	/**
	 * Vue.use() hook
	 * @param {Object} Vue
	 * @param {Object} options
	 */
	install(app: any) {
		addCollection(getIconsCollection(), this.defaultProvider)
		// register global methods
		app.config.globalProperties.$ds = this
	}

	/**
	 * Return the device type (tablet, mobile or desktop).
	 * @return {string} device type
	 */
	static get deviceType() {
		if (typeof window !== 'undefined') {
			const ua = navigator.userAgent
			if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
				return 'tablet'
			} else if (
				/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
					ua
				)
			) {
				return 'mobile'
			}
		}
		return 'desktop'
	}

	/**
	 * Return the browser name (chrome, safari, firefox or others).
	 * @return {string} browser name
	 */
	static get browser() {
		if (typeof window !== 'undefined') {
			const ua = navigator.userAgent.toLowerCase()
			if (ua.indexOf('safari') != -1) {
				if (ua.indexOf('chrome') > -1) {
					return 'chrome'
				} else {
					return 'safari'
				}
			}
			if (ua.indexOf('firefox') > -1) {
				return 'firefox'
			}
		}
		return 'other'
	}
}
