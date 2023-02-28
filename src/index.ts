import VolverPlugin from './Volver'
import type { Volver } from './Volver'

export { VolverPlugin }

// https://vuejs.org/guide/typescript/options-api.html#augmenting-global-properties
// Add custom property and extend vue type definition
declare module 'vue' {
	interface ComponentCustomProperties {
		$vv?: typeof Volver.prototype
	}
}
