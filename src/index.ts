import type { App } from 'vue'

import * as components from './components'

const DSLibrary = {
	install(app: App) {
		// Auto import all components
		for (const componentKey in components) {
			app.use((components as any)[componentKey])
		}
	}
}

export default DSLibrary

// export all components as vue plugin
export * from './components'

// export IconifyJSON default icons
export { default as iconsSimple } from './assets/icons/simple.json'
export { default as iconsNormal } from './assets/icons/normal.json'
export { default as iconsDetailed } from './assets/icons/detailed.json'
