import type { PlayAttributes } from '@/test/types'
import { within } from 'storybook/test'
import { expect } from '@/test/expect'

export async function namedSlotsTest({ canvasElement }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const card = element.getElementsByClassName('vv-card')[0] as HTMLElement
    const footer = card.getElementsByClassName('vv-card__footer')[0]
    const summary = card.getElementsByClassName('vv-accordion__summary')[0]

    const alert = card.getElementsByClassName('vv-alert')[0]

    // the default slot carries the children, as before
    expect(card.getElementsByClassName('vv-accordion')).toHaveLength(1)
    expect(card.getElementsByClassName('vv-alert')).toHaveLength(1)

    // the named slots the catalog declares reach the components
    expect(footer.textContent?.trim()).toBe('Download')
    expect(summary.textContent?.trim()).toBe('Custom summary')
    expect(
        alert.getElementsByClassName('vv-alert__footer')[0]?.textContent?.trim(),
    ).toBe('Retry')

    // accessibility
    await expect(element).toHaveNoViolations()
}
