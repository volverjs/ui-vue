import '@/stories/stories.scss'
import { setup } from '@storybook/vue3'
import DesignSystem from '@/DesignSystem'
import iconsSimple from '@/assets/icons/simple.json'
import iconsNormal from '@/assets/icons/normal.json'
import iconsDetailed from '@/assets/icons/detailed.json'

const volver = new DesignSystem({
	iconsCollections: [iconsSimple, iconsNormal, iconsDetailed]
})
setup((app) => {
	app.use(volver)
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
