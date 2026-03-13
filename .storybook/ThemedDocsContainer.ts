import type { DocsContextProps } from '@storybook/addon-docs/blocks'
import type { Renderer } from 'storybook/internal/csf'
import { DocsContainer } from '@storybook/addon-docs/blocks'
import * as React from 'react'
import { themes } from 'storybook/theming'
import { useIsDarkMode } from './hooks'

function ThemedDocsContainer(props: React.PropsWithChildren<{ context: unknown }>) {
    const isDarkMode = useIsDarkMode()

    return React.createElement(
        DocsContainer,
        { theme: isDarkMode ? themes.dark : themes.light, context: props.context as DocsContextProps<Renderer> },
        props.children,
    )
}

export default ThemedDocsContainer
