import fs from 'fs'
import glob from 'glob'
import { build } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'
import { externalizeDeps } from 'vite-plugin-externalize-deps'
import ESLint from 'vite-plugin-eslint'
import AutoImport from 'unplugin-auto-import/vite'
import { kebabCase } from 'change-case'

// eslint-disable-next-line no-undef
const hot = process.argv.includes('--hot')
const watch = hot ? {} : undefined
const minify = hot ? false : 'terser'

// load package.json and reset exports
const packageJson = JSON.parse(fs.readFileSync('./package.json'))
packageJson.exports = {
	'./src/*': './src/*',
	'./dist/*': './dist/*',
}
packageJson.typesVersions = {
	'*': {},
}

const baseConfig = {
	plugins: [
		vue({
			template: {
				compilerOptions: {
					comments: false,
				},
			},
		}),
		externalizeDeps(),
		ESLint(),
		AutoImport({
			// global imports to register
			imports: ['vue', '@vueuse/core'],
			// Auto import for module exports under directories
			// by default it only scan one level of modules under the directory
			dirs: ['./src/composables/**', './src/utils/'],
			dts: true,
			eslintrc: {
				enabled: true,
			},
		}),
	],
	configFile: false,
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('../src', import.meta.url)),
		},
	},
}

// build library
packageJson.exports['.'] = {
	types: './dist/index.d.ts',
	import: './dist/index.es.js',
	default: './dist/index.umd.js',
}
packageJson.typesVersions['*']['*'] = ['dist/index.d.ts']
build({
	...baseConfig,
	build: {
		watch,
		minify,
		emptyOutDir: false,
		lib: {
			name: 'volver',
			entry: './src/index.ts',
			fileName: (format) => `index.${format}.js`,
		},
	},
})

// build resolvers
packageJson.exports['./resolvers/unplugin'] = {
	types: './dist/resolvers/unplugin.d.ts',
	import: './dist/resolvers/unplugin.es.js',
	default: './dist/resolvers/unplugin.umd.js',
}
packageJson.typesVersions['*']['resolvers/unplugin'] = [
	'dist/resolvers/unplugin.d.ts',
]
build({
	...baseConfig,
	build: {
		watch,
		minify,
		emptyOutDir: false,
		lib: {
			name: 'components',
			entry: './src/resolvers/unplugin.ts',
			fileName: (format) => `resolvers/unplugin.${format}.js`,
		},
	},
})

// build icons
packageJson.exports[`./icons`] = {
	types: './dist/icons.d.ts',
	import: './dist/icons.es.js',
	default: './dist/icons.umd.js',
}
packageJson.typesVersions['*']['icons'] = ['dist/icons.d.ts']
build({
	configFile: false,
	build: {
		watch,
		minify,
		emptyOutDir: false,
		lib: {
			name: 'icons',
			entry: './src/icons.ts',
			fileName: (format) => `icons.${format}.js`,
		},
	},
})
build({
	configFile: false,
	build: {
		watch,
		minify,
		emptyOutDir: false,
		outDir: 'bin',
		ssr: true,
		lib: {
			name: 'generate-icons',
			entry: './scripts/icons.ts',
			fileName: (format) => `generate-icons.${format}.js`,
		},
	},
})

// build directives library
packageJson.exports['./directives'] = {
	types: './dist/directives/index.d.ts',
	import: './dist/directives/index.es.js',
	default: './dist/directives/index.umd.js',
}
packageJson.typesVersions['*']['directives'] = ['dist/directives/index.d.ts']
build({
	...baseConfig,
	build: {
		watch,
		minify,
		emptyOutDir: false,
		lib: {
			name: 'directives',
			entry: './src/directives/index.ts',
			fileName: (format) => `directives/index.${format}.js`,
		},
	},
})

// build single directives
const directives = glob.sync('./src/directives/v-!(_*).ts')
const directivesSources = directives.map((entry) => {
	const exportName = entry.replace(/.\/src\/|.ts|\/index/gm, '')
	const splittedExportName = exportName.split('/')
	const name = splittedExportName.pop()
	return {
		name,
		entry,
	}
})
directivesSources.forEach(({ name, entry }) => {
	const paramCaseName = kebabCase(name)
	const subPath = `directives/${name}`
	packageJson.exports[`./${paramCaseName}`] = {
		types: `./dist/${subPath}.d.ts`,
		import: `./dist/${subPath}.es.js`,
		default: `./dist/${subPath}.umd.js`,
	}
	packageJson.typesVersions['*'][paramCaseName] = [`dist/${subPath}.d.ts`]

	build({
		...baseConfig,
		build: {
			watch: hot ? {} : undefined,
			minify,
			lib: {
				name,
				entry,
				fileName: (format) => `${subPath}.${format}.js`,
			},
			emptyOutDir: false,
		},
	})
})

// build composables library
packageJson.exports['./composables'] = {
	types: './dist/composables/index.d.ts',
	import: './dist/composables/index.es.js',
	default: './dist/composables/index.umd.js',
}
packageJson.typesVersions['*']['composables'] = ['dist/composables/index.d.ts']
build({
	...baseConfig,
	build: {
		watch,
		minify,
		emptyOutDir: false,
		lib: {
			name: 'composables',
			entry: './src/composables/index.ts',
			fileName: (format) => `composables/index.${format}.js`,
		},
	},
})

// build components library
packageJson.exports['./components'] = {
	types: './dist/components/index.d.ts',
	import: './dist/components/index.es.js',
	default: './dist/components/index.umd.js',
}
packageJson.typesVersions['*']['components'] = ['dist/components/index.d.ts']
build({
	...baseConfig,
	build: {
		watch,
		minify,
		emptyOutDir: false,
		lib: {
			name: 'components',
			entry: './src/components/index.ts',
			fileName: (format) => `components/index.${format}.js`,
		},
	},
})

// build single components
const components = glob.sync('./src/components/**/!(_*).vue')
const componentsSources = components.map((entry) => {
	const exportName = entry.replace(/.\/src\/|.vue|\/index/gm, '')
	const splittedExportName = exportName.split('/')
	const name = splittedExportName.pop()
	return {
		name,
		entry,
	}
})
componentsSources.forEach(({ name, entry }) => {
	const paramCaseName = kebabCase(name)
	const subPath = `components/${name}/${name}`
	packageJson.exports[`./${paramCaseName}`] = {
		types: `./dist/${subPath}.vue.d.ts`,
		import: `./dist/${subPath}.es.js`,
		default: `./dist/${subPath}.umd.js`,
	}
	packageJson.typesVersions['*'][paramCaseName] = [`dist/${subPath}.vue.d.ts`]

	build({
		...baseConfig,
		build: {
			watch: hot ? {} : undefined,
			minify,
			lib: {
				name,
				entry,
				fileName: (format) => `${subPath}.${format}.js`,
			},
			emptyOutDir: false,
		},
	})
})

// sort exports
packageJson.exports = Object.keys(packageJson.exports)
	.sort((a, b) => (a === '.' ? -1 : b === '.' ? 1 : a > b))
	.reduce((exports, key) => {
		exports[key] = packageJson.exports[key]
		return exports
	}, {})

// update package.json
fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2))
