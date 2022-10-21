import '../src/stories/stories.scss'
import addons from '@storybook/addons'
import { app } from '@storybook/vue3'
import DesignSystem from '../src/DesignSystem'
import iconsSimple from '../src/assets/icons/simple.json'
import iconsNormal from '../src/assets/icons/normal.json'
import iconsDetailed from '../src/assets/icons/detailed.json'

const volver = new DesignSystem({
	iconsCollections: [iconsSimple, iconsNormal, iconsDetailed]
})
app.use(volver)

// get an instance to the communication channel for the manager and preview
const channel = addons.getChannel()
// switch body class for story
channel.on('updateGlobals', ({ globals }) => {
	// Intercept storybook global background changes to toggle css class "theme-dark"
	const isDark = globals?.backgrounds?.value === '#333333'
	if (isDark) {
		document.querySelector('html').classList.add('theme-dark')
	} else {
		document.querySelector('html').classList.remove('theme-dark')
	}
})

export const parameters = {
	actions: { argTypesRegex: '^on[A-Z].*' },
	controls: {
		expanded: true,
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/
		}
	}
}
