import type { PlayAttributes } from '@/test/types'
import { within } from 'storybook/test'
import { expect } from '@/test/expect'

export async function namedSlotsTest({ canvasElement }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const card = element.getElementsByClassName('vv-card')[0] as HTMLElement
    const footer = card.querySelector(':scope > .vv-card__footer') as HTMLElement
    const summary = card.getElementsByClassName('vv-accordion__summary')[0]
    const alert = card.getElementsByClassName('vv-alert')[0]
    const plain = card.getElementsByClassName('vv-card')[0]

    // a slot the catalog does not declare is not handed on
    expect(
        alert.getElementsByClassName('vv-alert__title')[0]?.textContent?.trim(),
    ).toBe('Heads up')
    expect(alert.textContent).not.toContain('Stray header')

    // a named slot with nothing to render is no slot
    expect(plain.getElementsByClassName('vv-card__footer')).toHaveLength(0)

    // the card header replaces the title
    expect(
        card.querySelector(':scope > .vv-card__header')?.textContent?.trim(),
    ).toBe('Invoice 42')

    // the default slot carries the children, as before
    expect(card.getElementsByClassName('vv-accordion')).toHaveLength(1)
    expect(card.getElementsByClassName('vv-alert')).toHaveLength(2)

    // the named slots the catalog declares reach the components
    expect(footer.textContent?.trim()).toBe('Download')
    expect(summary.textContent?.trim()).toBe('Custom summary')
    expect(
        alert.getElementsByClassName('vv-alert__footer')[0]?.textContent?.trim(),
    ).toBe('Retry')

    // a spec always lists `children`, empty for a leaf: that is no default
    // slot, so the alert, with neither children nor content, draws no content box
    expect(alert.getElementsByClassName('vv-alert__content')).toHaveLength(0)

    // nor does one with no `children` at all, which Vue hands on as a comment
    const bare = card.getElementsByClassName('vv-alert')[1]
    expect(bare.getElementsByClassName('vv-alert__content')).toHaveLength(0)

    // accessibility
    await expect(element).toHaveNoViolations()
}
