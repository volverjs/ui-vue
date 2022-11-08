import fs from 'fs'
import glob from 'glob'
import { build } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'
import { externalizeDeps } from 'vite-plugin-externalize-deps'
import { paramCase } from 'change-case'
import dts from 'vite-plugin-dts'

// load package.json and reset exports
const packageJson = JSON.parse(fs.readFileSync('./package.json'))
packageJson.exports = {
	'./src/*': './src/*',
	'./dist/*': './dist/*'
}

const baseConfig = {
	plugins: [vue(), externalizeDeps(), dts()],
	configFile: false,
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('../src', import.meta.url))
		}
	}
}

// build library
packageJson.exports['.'] = {
	import: './dist/ui-vue.js',
	default: './dist/ui-vue.umd.js'
}
build({
	...baseConfig,
	build: {
		emptyOutDir: false,
		lib: {
			name: 'ui-vue',
			entry: './src/index.ts',
			fileName: (format) => `ui-vue.${format}.js`
		}
	}
})

// build icons
packageJson.exports[`./icons`] = {
	import: './dist/icons.js',
	default: './dist/icons.umd.js'
}
build({
	configFile: false,
	build: {
		emptyOutDir: false,
		lib: {
			name: 'icons',
			entry: './src/assets/icons/index.js',
			fileName: (format) => `icons.${format}.js`
		}
	}
})

// build components
glob('./src/components/**/!(_*).vue', async (err, files) => {
	const sources = files.map((entry) => {
		const exportName = entry.replace(/.\/src\/|.vue|\/index/gm, '')
		const splittedExportName = exportName.split('/')
		const name = paramCase(splittedExportName.pop())
		return {
			name,
			entry
		}
	})

	// build
	await Promise.all(
		sources.map(({ name, entry }) => {
			packageJson.exports[`./${name}`] = {
				import: `./dist/components/${name}.js`,
				default: `./dist/components/${name}.umd.js`
			}

			return build({
				...baseConfig,
				build: {
					lib: {
						name,
						entry,
						fileName: (format) => `components/${name}.${format}.js`
					},
					emptyOutDir: false
				}
			})
		})
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
