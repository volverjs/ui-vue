import { setup } from '@storybook/vue3'
import VolverPlugin from '@/Volver'
import iconsSimple from '@/assets/icons/simple.json'
import iconsNormal from '@/assets/icons/normal.json'
import iconsDetailed from '@/assets/icons/detailed.json'
import { themes } from '@storybook/theming'
import './style.scss'

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
