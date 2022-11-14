import '@/stories/stories.scss'
import { setup } from '@storybook/vue3'
import VolverPlugin from '@/Volver'
import iconsSimple from '@/assets/icons/simple.json'
import iconsNormal from '@/assets/icons/normal.json'
import iconsDetailed from '@/assets/icons/detailed.json'

setup((app) => {
	app.use(VolverPlugin, {
		iconsCollections: [iconsSimple, iconsNormal, iconsDetailed]
	})
})

export const parameters = {
	actions: { argTypesRegex: '^on[A-Z].*' },
	controls: {
		expanded: true,
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/
		}
	},
	darkMode: {
		// Set the initial theme
		// current: 'light',
		darkClass: 'theme--dark',
		lightClass: 'theme--light',
		stylePreview: true
	}
}
