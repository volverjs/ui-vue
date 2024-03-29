import type {
	ComponentResolver,
	SideEffectsInfo,
} from 'unplugin-vue-components/types'
import { kebabCase } from 'change-case'

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
	/**
	 * cherry pick components from named exports
	 * @default undefined
	 */
	cherryPick?: boolean
}

const STYLE_EXCLUDE = ['vv-icon', 'vv-action']
const VOLVER_PREFIX = 'vv'
const DIRECTIVES = ['v-tooltip', 'v-contextmenu']

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
			'vv-dropdown-option',
			'vv-dropdown-optgroup',
			'vv-dropdown',
			'vv-dropdown-action',
		]
	}
	if (kebabName === 'vv-button-group') {
		return ['vv-button', 'vv-button-group']
	}
	if (kebabName === 'vv-accordion-group') {
		return ['vv-accordion', 'vv-accordion-group']
	}
	if (kebabName === 'vv-checkbox-group') {
		return ['vv-checkbox', 'vv-checkbox-group']
	}
	if (kebabName === 'vv-radio-group') {
		return ['vv-radio', 'vv-radio-group']
	}
	if (kebabName === 'vv-alert-group') {
		return ['vv-alert', 'vv-alert-group']
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
	cherryPick,
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
				if (cherryPick) {
					return {
						from: `@volverjs/ui-vue/${kebabName}`,
						sideEffects: getSideEffects(kebabName, importStyle),
					}
				}
				return {
					from: '@volverjs/ui-vue/components',
					sideEffects: getSideEffects(kebabName, importStyle),
					name,
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
				if (cherryPick) {
					return {
						from: `@volverjs/ui-vue/${kebabName}`,
						sideEffects: getSideEffects(kebabName, importStyle),
					}
				}
				return {
					from: '@volverjs/ui-vue/directives',
					sideEffects: getSideEffects(kebabName, importStyle),
					name: `v${name}`,
				}
			},
		},
	]
}
