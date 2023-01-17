import fs from 'fs'
import glob from 'glob'
import { build } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'
import { externalizeDeps } from 'vite-plugin-externalize-deps'
import ESLint from 'vite-plugin-eslint'
import { paramCase } from 'change-case'

// eslint-disable-next-line no-undef
const hot = process.argv.includes('--hot')
const watch = hot ? {} : undefined
const minify = hot ? false : undefined

// load package.json and reset exports
const packageJson = JSON.parse(fs.readFileSync('./package.json'))
packageJson.exports = {
	'./src/*': './src/*',
	'./dist/*': './dist/*',
}

const baseConfig = {
	plugins: [vue(), externalizeDeps(), ESLint()],
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

// build components library
packageJson.exports['./components'] = {
	types: './dist/components/index.d.ts',
	import: './dist/components/index.es.js',
	default: './dist/components/index.umd.js',
}
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

// build resolvers
packageJson.exports['./resolvers/unplugin'] = {
	types: './dist/resolvers/unplugin.d.ts',
	import: './dist/resolvers/unplugin.es.js',
	default: './dist/resolvers/unplugin.umd.js',
}
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

// build components
glob('./src/components/**/!(_*).vue', async (err, files) => {
	const sources = files.map((entry) => {
		const exportName = entry.replace(/.\/src\/|.vue|\/index/gm, '')
		const splittedExportName = exportName.split('/')
		const name = splittedExportName.pop()
		return {
			name,
			entry,
		}
	})

	// build
	await Promise.all(
		sources.map(({ name, entry }) => {
			const paramCaseName = paramCase(name)
			const subPath = `components/${name}/${name}`
			packageJson.exports[`./${paramCaseName}`] = {
				types: `./dist/${subPath}.vue.d.ts`,
				import: `./dist/${subPath}.es.js`,
				default: `./dist/${subPath}.umd.js`,
			}

			return build({
				...baseConfig,
				build: {
					watch: hot ? {} : undefined,
					minify: hot ? false : undefined,
					lib: {
						name,
						entry,
						fileName: (format) => `${subPath}.${format}.js`,
					},
					emptyOutDir: false,
				},
			})
		}),
	)

	// sort exports
	packageJson.exports = Object.keys(packageJson.exports)
		.sort((a, b) => (a === '.' ? -1 : b === '.' ? 1 : a > b))
		.reduce((exports, key) => {
			exports[key] = packageJson.exports[key]
			return exports
		}, {})

	fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2))
})
