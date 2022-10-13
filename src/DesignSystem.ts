import { addCollection } from '@iconify/vue'
import iconsSimple from './assets/icons/simple.json'
import iconsNormal from './assets/icons/normal.json'
import iconsDetailed from './assets/icons/detailed.json'

// https://vuejs.org/guide/typescript/options-api.html#augmenting-global-properties
declare module 'vue' {
	interface ComponentCustomProperties {
		$ds: typeof DesignSystem.prototype
	}
}

interface IDesignSystem {
	defaultProvider: string
	/**
	 * @param {String} src Icon source path (url)
	 * @param {RequestInit} options https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.requestinit.html
	 */
	fetchIcon(src: string, options?: any): Promise<string | undefined>
	fetchWithCredentials: boolean
}

export const VV_PROVIDER = 'vv-provider'

export default class DesignSystem implements IDesignSystem {
	defaultProvider: string
	fetchOptions: any
	fetchWithCredentials: boolean

	/**
	 * Optional fetch options for remote call
	 * @param {RequestInit} fetchOptions https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.requestinit.html
	 */
	constructor({
		fetchWithCredentials = false,
		fetchOptions = {
			cache: 'force-cache',
			credentials: 'omit'
		}
	} = {}) {
		if (fetchWithCredentials) {
			fetchOptions = { ...fetchOptions, credentials: 'include' }
		}
		this.fetchWithCredentials = fetchWithCredentials
		this.fetchOptions = fetchOptions
		this.defaultProvider = VV_PROVIDER
	}

	/**
	 * Vue.use() hook
	 * @param {Object} Vue
	 * @param {Object} options
	 */
	install(app: any) {
		// Add default icons collection (simple, normal, detailed)
		addCollection(iconsSimple, this.defaultProvider)
		addCollection(iconsNormal, this.defaultProvider)
		addCollection(iconsDetailed, this.defaultProvider)
		// register global methods
		app.config.globalProperties.$ds = this
	}

	fetchIcon(src: string, options?: any): Promise<string | undefined> {
		return new Promise((resolve, reject) => {
			fetch(src, { ...this.fetchOptions, ...options })
				.catch((e) => reject(e))
				.then((response) => response?.text())
				.then((svg?: string) => resolve(svg))
		})
	}
}
