import {
	addCollection,
	addIcon,
	type IconifyIcon,
	type IconifyJSON
} from '@iconify/vue'
import type { App } from 'vue'

// https://vuejs.org/guide/typescript/options-api.html#augmenting-global-properties
// Add custom property and extend vue type definition
declare module 'vue' {
	interface ComponentCustomProperties {
		$ds: typeof DesignSystem.prototype
	}
}

interface IDesignSystemParams {
	/**
	 * If true set "fetchOptions" with credentials: 'include'
	 */
	fetchWithCredentials?: boolean
	/**
	 * Optional fetch params
	 */
	fetchOptions?: RequestInit
	/**
	 * Array of https://docs.iconify.design/types/iconify-json.html
	 * This collections will be added during plugin install
	 */
	iconsCollections?: IconifyJSON[]
}

interface IDesignSystem extends IDesignSystemParams {
	/**
	 * @param {String} src Icon source path (url)
	 * @param {RequestInit} options
	 * @returns {Promise<string | undefined>} String SVG if exist
	 */
	fetchIcon(src: string, options?: RequestInit): Promise<string | undefined>
	/**
	 * Add iconify collection to library https://docs.iconify.design/icon-components/vue/add-collection.html
	 * @param {IconifyJSON} collection
	 * @param {String} providerName Optional provider name
	 */
	addCollection(collection: IconifyJSON, providerName?: string): boolean
	/**
	 * Add icon to collection https://docs.iconify.design/icon-components/vue/add-icon.html
	 * @param {String} name
	 * @param {IconifyIcon} data
	 * @returns {Boolean} true on success, false if something is wrong with data
	 */
	addIcon(name: string, data: IconifyIcon): boolean
}

export default class DesignSystem implements IDesignSystem {
	fetchOptions: RequestInit
	iconsCollections: IconifyJSON[]
	#provider: string

	constructor({
		fetchWithCredentials = false,
		fetchOptions = {},
		iconsCollections = []
	}: IDesignSystemParams = {}) {
		if (fetchWithCredentials) {
			fetchOptions = { ...fetchOptions, credentials: 'include' }
		}
		this.#provider = 'vv'
		this.fetchOptions = fetchOptions
		this.iconsCollections = iconsCollections
	}

	/**
	 * Vue.use() hook
	 * @param {App} Vue
	 * @param {Object} options
	 */
	install(app: App) {
		// Add default icons collection (simple, normal, detailed)
		// and others custom collections
		this.iconsCollections.forEach((iconsCollection) => {
			this.addCollection(iconsCollection, this.#provider)
		})

		// register global methods
		app.config.globalProperties.$ds = this
	}

	addCollection(collection: IconifyJSON, providerName?: string): boolean {
		return addCollection(collection, providerName)
	}

	addIcon(name: string, data: IconifyIcon): boolean {
		return addIcon(name, data)
	}

	fetchIcon(src: string, options?: RequestInit): Promise<string | undefined> {
		return new Promise((resolve, reject) => {
			fetch(src, { ...this.fetchOptions, ...options })
				.catch((e) => reject(e))
				.then((response) => response?.text())
				.then((svg?: string) => resolve(svg))
		})
	}
}
