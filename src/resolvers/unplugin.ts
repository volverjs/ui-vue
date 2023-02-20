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

type ImportStyle = boolean | 'css' | 'scss'

export interface VolverResolverOptions {
	/**
	 * import style along with components
	 * @default undefined
	 */
	importStyle?: ImportStyle
	/**
	 * enable/disable directives
	 * @default undefined
	 */
	directives?: boolean
	/**
	 * prefix for components (e.g. 'vv' to resolve Button from VvButton)
	 *
	 * @default 'vv'
	 */
	prefix?: string
	/**
	 * ignore components (kebab-case)
	 * @default undefined
	 */
	ignore?: string[]
}

const STYLE_EXCLUDE = ['vv-icon', 'vv-action']
const VOLVER_PREFIX = 'vv'
const DIRECTIVES = ['v-tooltip']

export const getStyleNames = function (kebabName: string) {
	if (STYLE_EXCLUDE.includes(kebabName)) {
		return undefined
	}
	if (kebabName === 'vv-dropdown') {
		return ['vv-dropdown', 'vv-dropdown-option', 'vv-dropdown-action']
	}
	if (kebabName === 'vv-combobox') {
		return [
			'vv-select',
			'vv-dropdown',
			'vv-dropdown-option',
			'vv-dropdown-action',
		]
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
	if (kebabName === 'v-tooltip') {
		return ['vv-tooltip']
	}
	return [kebabName]
}

const getSideEffects = function (kebabName: string, importStyle?: ImportStyle) {
	const sideEffects: SideEffectsInfo = []

	if (!importStyle) {
		return sideEffects
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

	return sideEffects
}

/**
 * Resolver for @volverjs/ui-vue
 *
 * @link https://github.com/volverjs/ui-vue
 */
export function VolverResolver({
	prefix = VOLVER_PREFIX,
	importStyle,
	directives,
	ignore,
}: VolverResolverOptions = {}): ComponentResolver[] {
	return [
		{
			type: 'component',
			resolve: (name: string) => {
				if (
					!prefix ||
					!name.toLowerCase().startsWith(prefix.toLowerCase())
				) {
					return
				}
				const kebabName = kebabCase(name).replace(
					`${prefix}-`,
					`${VOLVER_PREFIX}-`,
				)

				if (ignore && ignore.includes(kebabName)) {
					return
				}

				// import component
				return {
					from: `@volverjs/ui-vue/${kebabName}`,
					sideEffects: getSideEffects(kebabName, importStyle),
				}
			},
		},
		{
			type: 'directive',
			resolve: (name: string) => {
				if (!directives) {
					return
				}

				const kebabName = `v-${kebabCase(name)}`

				// filter directive
				if (!DIRECTIVES.includes(kebabName)) {
					return
				}

				if (ignore && ignore.includes(kebabName)) {
					return
				}

				// import directive
				return {
					from: `@volverjs/ui-vue/${kebabName}`,
					sideEffects: getSideEffects(kebabName, importStyle),
				}
			},
		},
	]
}
