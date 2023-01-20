import { setup } from '@storybook/vue3'
import VolverPlugin from '@/Volver'
import packageJson from '../package.json'
import iconsSimple from '@/assets/icons/simple.json'
import iconsNormal from '@/assets/icons/normal.json'
import iconsDetailed from '@/assets/icons/detailed.json'
import { themes } from '@storybook/theming'
import './style.scss'

const fullVersion = packageJson.version
const fullSplittedVersion = fullVersion.split('-')
let postfix = null 
if(fullSplittedVersion.length > 1) {
	// ex: 'beta.1'
	postfix = fullSplittedVersion[1]
}
const splittedVersion = fullSplittedVersion[0].split('.')
const major = splittedVersion[0] || 0
const minor = splittedVersion[1] || 0
const patch = splittedVersion[2] || 0

setup((app) => {
	const bodyClasses = document.getElementsByTagName('body')[0].classList
	if (
		bodyClasses &&
		!document.getElementById('storybook-docs')?.getAttribute('hidden')
	) {
		// inside docs mode, the body class has 'sb-show-main'
		bodyClasses.remove('theme--dark')
		bodyClasses.add('theme--light')
	}
	bodyClasses.add('theme')
	app.use(VolverPlugin, {
		iconsCollections: [iconsSimple, iconsNormal, iconsDetailed],
	})
})

export const parameters = {
	actions: { argTypesRegex: '^on[A-Z].*' },
	controls: {
		expanded: true,
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
	docs: {
		theme: themes.normal,
	},
	version: {
		major,
		minor,
		patch,
		postfix
	},
	darkMode: {
		classTarget: 'body',
		darkClass: 'theme--dark',
		lightClass: 'theme--light',
		stylePreview: true,
		dark: {
			...themes.dark,
			brandImage: 'brand-dark.svg',
		},
		light: {
			...themes.normal,
			brandImage: 'brand.svg',
		},
	},
}
