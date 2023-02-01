import type {
	ComponentResolver,
	SideEffectsInfo,
} from 'unplugin-vue-components/types'

function kebabCase(str: string, options?: { condense: boolean }) {
	if (typeof str !== 'string') throw new TypeError('expected a string')
	return str
		.trim()
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.replace(/\W/g, (m) => (/[À-ž]/.test(m) ? m : '-'))
		.replace(/^-+|-+$/g, '')
		.replace(/-{2,}/g, (m) => (options?.condense ? '-' : m))
		.toLowerCase()
}

export interface VolverResolverOptions {
	/**
	 * import style along with components
	 *
	 * @default 'css'
	 */
	importStyle?: boolean | 'css' | 'scss'
	/**
	 * import custom style path
	 *
	 * @default ''
	 */
	customStylePath?: string
	/**
	 * prefix for components (e.g. 'vv' to resolve Button from VvButton)
	 *
	 * @default 'vv'
	 */
	prefix?: string
}

const STYLE_EXCLUDE = ['vv-icon']
const VOLVER_PREFIX = 'vv'

const getStyleNames = function (kebabName: string) {
	if (STYLE_EXCLUDE.includes(kebabName)) {
		return undefined
	}
	if (kebabName === 'vv-dropdown') {
		return ['vv-dropdown', 'vv-dropdown-action']
	}
	if (kebabName === 'vv-combobox') {
		return ['vv-select', 'vv-dropdown', 'vv-dropdown-action']
	}
	if (kebabName === 'vv-accordion-group') {
		return ['vv-accordion-group', 'vv-accordion']
	}
	if (kebabName === 'vv-checkbox-group') {
		return ['vv-checkbox-group', 'vv-checkbox']
	}
	if (kebabName === 'vv-radio-group') {
		return ['vv-radio-group', 'vv-radio']
	}
	return [kebabName]
}

/**
 * Resolver for @volverjs/ui-vue
 *
 * @link https://github.com/volverjs/ui-vue
 */
export function VolverResolver({
	prefix = VOLVER_PREFIX,
	importStyle,
	customStylePath,
}: VolverResolverOptions = {}): ComponentResolver {
	return {
		type: 'component',
		resolve: (name: string) => {
			if (
				!prefix ||
				!name.toLowerCase().startsWith(prefix.toLowerCase())
			) {
				return
			}

			const sideEffects: SideEffectsInfo = []
			const kebabName = kebabCase(name).replace(
				`${prefix}-`,
				`${VOLVER_PREFIX}-`,
			)

			if (importStyle) {
				// import custom style
				if (customStylePath) {
					sideEffects.push(customStylePath)
				}

				// import component style
				const styleNames = getStyleNames(kebabName)
				if (styleNames) {
					styleNames.forEach((name) => {
						sideEffects.push(
							`@volverjs/style/${
								importStyle === 'scss' ? 'scss/' : ''
							}components/${name}`,
						)
					})
				}
			}

			// import component
			return {
				from: `@volverjs/ui-vue/${kebabName}`,
				sideEffects,
			}
		},
	}
}
