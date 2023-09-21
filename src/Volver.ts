import {
	addCollection,
	addIcon,
	addAPIProvider,
	type IconifyIcon,
	type IconifyJSON,
	type PartialIconifyAPIConfig,
} from '@iconify/vue'
import type { App, Component, Directive, Plugin, Ref } from 'vue'
import { DEFAULT_ICONIFY_PROVIDER, INJECTION_KEY_VOLVER } from './constants'

export function useDefaultProps(
	component: Component,
	defaults?: Record<string, unknown>,
	name?: string,
) {
	const componentName = name || component.name

	if (!componentName) {
		return component
	}

	const componentDefaults = defaults?.[componentName] as Record<
		string,
		unknown
	>
	const props = (component as Record<string, unknown>).props as Record<
		string,
		unknown
	>

	if (!componentDefaults || !props) {
		return { ...component, name: componentName }
	}

	return {
		...component,
		name: componentName,
		props: Object.keys(props).reduce(
			(acc, key) => {
				if (!(key in componentDefaults)) {
					acc[key] = props[key]
					return acc
				}
				const customDefault = componentDefaults[key]
				if (
					typeof props[key] === 'function' ||
					Array.isArray(props[key])
				) {
					acc[key] = {
						type: props[key],
						default: customDefault,
					}
					return acc
				}
				acc[key] = {
					...(props[key] as Record<string, unknown>),
					default: customDefault,
				}
				return acc
			},
			{} as Record<string, unknown>,
		),
	}
}

export type DefaultOptions = Record<string, Record<string, unknown>>

export type VolverOptions = {
	/**
	 * If true set "fetchOptions" with credentials: 'include'
	 */
	fetchWithCredentials?: boolean
	/**
	 * Optional fetch params
	 */
	fetchOptions?: RequestInit
	/**
	 * Array of iconify collections that will be added during plugin install
	 * @see https://docs.iconify.design/types/iconify-json.html
	 */
	iconsCollections?: IconifyJSON[]
	/**
	 * Set true inside nuxt
	 */
	nuxt?: boolean
	/**
	 * Default iconify provider
	 * @see https://docs.iconify.design/icon-components/vue/add-collection.html
	 * @default 'vv'
	 */
	iconsProvider?: string
	/**
	 * Components to install
	 */
	components?: Record<string, Component>
	/**
	 * Alias to install
	 */
	aliases?: Record<string, Component>
	/**
	 * Directives to install
	 */
	directives?: Record<string, Directive>
	/**
	 * Default props for components
	 */
	defaults?: DefaultOptions
}

export interface VolverInterface {
	/**
	 * @param {String} src Icon source path (url)
	 * @param {RequestInit} options
	 * @returns {Promise<string | undefined>} String SVG if exist
	 */
	fetchIcon(src: string, options?: RequestInit): Promise<string | undefined>
	/**
	 * Add iconify collection to library
	 * @see https://docs.iconify.design/icon-components/vue/add-collection.html
	 * @param {IconifyJSON} collection
	 * @param {String} providerName Optional provider name
	 */
	addCollection(collection: IconifyJSON, providerName?: string): boolean
	/**
	 * Add icon to collection
	 * @see https://docs.iconify.design/icon-components/vue/add-icon.html
	 * @param {String} name
	 * @param {IconifyIcon} data
	 * @returns {Boolean} true on success, false if something is wrong with data
	 */
	addIcon(name: string, data: IconifyIcon): boolean
	/**
	 * Add custom config for icons provider
	 * @param {String} provider
	 * @param {PartialIconifyAPIConfig} customConfig
	 * @returns {Boolean} true on success, false if something is wrong with data
	 */
	addIconsAPIProvider(
		provider: string,
		customConfig: PartialIconifyAPIConfig,
	): boolean
	/**
	 * Current provider
	 */
	iconsProvider: string
	/**
	 * Array of installed iconify collections
	 * @see https://docs.iconify.design/types/iconify-json.html
	 */
	iconsCollections: IconifyJSON[]
	/**
	 * Set true inside nuxt
	 */
	nuxt: boolean
	/**
	 * Components defaults options
	 */
	defaults: Ref<DefaultOptions>
}

export class Volver implements VolverInterface {
	private _fetchOptions: RequestInit = {}
	private _iconsCollections: IconifyJSON[] = []
	private _iconsProvider = DEFAULT_ICONIFY_PROVIDER
	private _nuxt = false
	defaults: Ref<DefaultOptions> = ref({})

	constructor({
		fetchWithCredentials,
		fetchOptions,
		iconsProvider,
		nuxt,
		iconsCollections,
		defaults,
	}: VolverOptions = {}) {
		// fetch options
		if (fetchOptions) {
			this._fetchOptions = fetchOptions
		}
		// fetch with credentials sugar syntax
		if (fetchWithCredentials) {
			this._fetchOptions = {
				...this._fetchOptions,
				credentials: 'include',
			}
		}
		// default iconify provider
		if (iconsProvider) {
			this._iconsProvider = iconsProvider
		}
		// enable nuxt mode
		if (nuxt) {
			this._nuxt = nuxt
		}
		// add iconify collections
		if (iconsCollections && Array.isArray(iconsCollections)) {
			iconsCollections.forEach((iconsCollection) => {
				this.addCollection(iconsCollection, this._iconsProvider)
			})
		}
		if (defaults) {
			this.defaults.value = defaults
		}
	}

	get nuxt(): boolean {
		return this._nuxt
	}

	get iconsProvider(): string {
		return this._iconsProvider
	}

	get iconsCollections(): IconifyJSON[] {
		return this._iconsCollections
	}

	addCollection(
		collection: IconifyJSON,
		providerName: string = this._iconsProvider,
	): boolean {
		this._iconsCollections.push(collection)
		return addCollection(collection, providerName)
	}

	addIcon(name: string, data: IconifyIcon): boolean {
		return addIcon(name, data)
	}

	addIconsAPIProvider(
		provider: string,
		customConfig: PartialIconifyAPIConfig,
	): boolean {
		return addAPIProvider(provider, customConfig)
	}

	fetchIcon(
		src: string,
		options: RequestInit = { cache: 'force-cache' },
	): Promise<string | undefined> {
		return new Promise((resolve, reject) => {
			fetch(src, { ...this._fetchOptions, ...options })
				.catch((e) => reject(e))
				.then((response) => response?.text())
				.then((svg?: string) => resolve(svg))
		})
	}
}

const VolverPlugin: Plugin = {
	/**
	 * Vue.use() hook
	 * @param {App} Vue
	 * @param {Object} options
	 */
	install(app: App, options: VolverOptions = {}) {
		const volver = new Volver(options)

		// register global methods
		app.config.globalProperties.$vv = volver

		// register components
		if (options.components) {
			Object.entries(options.components).forEach(([name, component]) => {
				app.component(
					name,
					useDefaultProps(component, options.defaults),
				)
			})
		}

		// register aliases
		if (options.aliases) {
			Object.entries(options.aliases).forEach(([name, component]) => {
				app.component(
					name,
					useDefaultProps(component, options.defaults, name),
				)
			})
		}

		// register directives
		if (options.directives) {
			Object.entries(options.directives).forEach(([name, directive]) => {
				app.directive(name, directive)
			})
		}

		// provide volver to components
		app.provide(INJECTION_KEY_VOLVER, volver)
	},
}

export default VolverPlugin
export * from './types'
