import { addCollection, type IconifyJSON } from '@iconify/vue'
import type { App } from 'vue'

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
	addCollection(collection: IconifyJSON, providerName?: string): boolean
	fetchWithCredentials: boolean
	iconifyCollections: IconifyJSON[]
}

const VV_PROVIDER = 'vv'

export default class DesignSystem implements IDesignSystem {
	defaultProvider: string
	fetchOptions: any
	fetchWithCredentials: boolean
	iconifyCollections: IconifyJSON[]

	/**
	 * Optional fetch options for remote call
	 * @param {RequestInit} fetchOptions https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.requestinit.html
	 */
	constructor({
		fetchWithCredentials = false,
		fetchOptions = {
			cache: 'force-cache',
			credentials: 'omit'
		},
		iconifyCollections = [],
		defaultProvider = VV_PROVIDER
	} = {}) {
		if (fetchWithCredentials) {
			fetchOptions = { ...fetchOptions, credentials: 'include' }
		}
		this.fetchWithCredentials = fetchWithCredentials
		this.fetchOptions = fetchOptions
		this.defaultProvider = defaultProvider
		this.iconifyCollections = iconifyCollections
	}

	/**
	 * Vue.use() hook
	 * @param {Object} Vue
	 * @param {Object} options
	 */
	install(app: App) {
		// Add default icons collection (simple, normal, detailed)
		// and others custom collections
		this.iconifyCollections.forEach((iconifyCollection) => {
			this.addCollection(iconifyCollection, this.defaultProvider)
		})
		// register global methods
		app.config.globalProperties.$ds = this
	}

	addCollection(collection: IconifyJSON, providerName?: string): boolean {
		return addCollection(collection, providerName || this.defaultProvider)
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
