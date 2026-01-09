import { DocsContainer } from '@storybook/addon-docs/blocks'
import * as React from 'react'
import { themes } from 'storybook/theming'
import { useIsDarkMode } from './hooks'

function ThemedDocsContainer(props: any) {
    const isDarkMode = useIsDarkMode()

    return (
        <DocsContainer theme={isDarkMode ? themes.dark : themes.light} context={props.context}>
            { props.children }
        </DocsContainer>
    )
}

export default ThemedDocsContainer
