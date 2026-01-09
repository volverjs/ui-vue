import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3-vite'
import { themes } from 'storybook/theming'
import packageJson from '../package.json'
import iconsDetailed from '../src/assets/icons/detailed.json'
import iconsNormal from '../src/assets/icons/normal.json'
import iconsSimple from '../src/assets/icons/simple.json'
import * as directives from '../src/directives'
import VolverPlugin from '../src/Volver'
import ThemedDocsContainer from './ThemedDocsContainer'
import './style.scss'

const fullVersion = packageJson.version
const fullSplittedVersion = fullVersion.split('-')
let postfix
if (fullSplittedVersion.length > 1) {
    postfix = fullSplittedVersion[1]
}
const splittedVersion = fullSplittedVersion[0].split('.')
const major = splittedVersion[0] || 0
const minor = splittedVersion[1] || 0
const patch = splittedVersion[2] || 0

setup((app) => {
    app.use(VolverPlugin, {
        iconsCollections: [iconsSimple, iconsNormal, iconsDetailed],
        directives,
    })
})

const preview: Preview = {
    parameters: {
        backgrounds: { disable: true },
        controls: {
            expanded: true,
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
        version: {
            major,
            minor,
            patch,
            postfix,
        },
        docs: {
            container: ThemedDocsContainer,
        },
        darkMode: {
            current: 'dark',
            classTarget: 'html',
            darkClass: ['theme', 'theme--dark'],
            lightClass: ['theme', 'theme--light'],
            stylePreview: true,
            dark: {
                ...themes.dark,
                base: 'dark',
                brandImage: 'brand-dark.svg',
            },
            light: {
                ...themes.light,
                base: 'light',
                brandImage: 'brand.svg',
            },
        },
    },
}

export default preview
