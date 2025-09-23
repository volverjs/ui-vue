import { setup } from '@storybook/vue3-vite'
import { themes } from 'storybook/theming'
import packageJson from '../package.json'
import iconsDetailed from '../src/assets/icons/detailed.json'
import iconsNormal from '../src/assets/icons/normal.json'
import iconsSimple from '../src/assets/icons/simple.json'
import * as directives from '../src/directives'
import VolverPlugin from '../src/Volver'
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
    const bodyClasses = document.getElementsByTagName('body')[0].classList
    if (
        bodyClasses
        && !document.getElementById('storybook-docs')?.getAttribute('hidden')
    ) {
        bodyClasses.remove('theme--dark')
        bodyClasses.add('theme--light')
    }
    bodyClasses.add('theme')
    app.use(VolverPlugin, {
        iconsCollections: [iconsSimple, iconsNormal, iconsDetailed],
        directives,
    })
})

export const parameters = {
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
        postfix,
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
