// eslint-disable-next-line
declare interface Window {
	// extend the window
}

declare module '*.vue' {
	import type { DefineComponent } from 'vue'
	// eslint-disable-next-line
	const component: DefineComponent<{}, {}, any>
	export default component
}

type ValueOf<T> = T[keyof T]
