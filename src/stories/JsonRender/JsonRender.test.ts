import type { PlayAttributes } from '@/test/types'
import { within } from 'storybook/test'
import { expect } from '@/test/expect'

export async function iconOnlyButtonTest({ canvasElement }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const button = element.getElementsByClassName('vv-button')[0] as HTMLElement

    // an empty `children` is no default slot, so the button is icon only,
    // and the spec gives it the accessible name it has no label for
    expect(button).toHaveClass('vv-button--icon-only')
    expect(button.getAttribute('aria-label')).toBe('Add an item')

    // accessibility
    await expect(element).toHaveNoViolations()
}

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

export async function fieldsWithoutLabelTest({ canvasElement }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const canvas = within(element)

    // no field draws a label, so each name comes from `ariaLabel` alone, on
    // the element assistive technology announces
    expect(canvas.getByRole('textbox', { name: 'Search the catalog' })).toBeTruthy()
    expect(canvas.getByRole('textbox', { name: 'Notes' })).toBeTruthy()
    expect(canvas.getByRole('combobox', { name: 'Country' })).toBeTruthy()
    expect(canvas.getByRole('combobox', { name: 'Ward' })).toBeTruthy()
    expect(canvas.getByRole('checkbox', { name: 'Accept the terms' })).toBeTruthy()
    expect(canvas.getByRole('radio', { name: 'Pro plan' })).toBeTruthy()
    expect(canvas.getByRole('group', { name: 'Channels' })).toBeTruthy()
    expect(canvas.getByRole('group', { name: 'Size' })).toBeTruthy()
    expect(canvas.getByRole('slider', { name: 'Volume' })).toBeTruthy()
    // a file input has no role of its own to look it up by
    expect(canvas.getByLabelText('Invoice')).toHaveAttribute('type', 'file')

    // accessibility
    await expect(element).toHaveNoViolations()
}

export async function dialogWithoutTitleTest({ canvasElement }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const dialog = element.getElementsByTagName('dialog')[0]

    // with no title to point at, the name is the `ariaLabel` of the spec
    expect(dialog).toHaveProperty('open', true)
    expect(dialog).not.toHaveAttribute('aria-labelledby')
    expect(within(element).getByRole('dialog', { name: 'Confirm the order' })).toBe(dialog)

    // accessibility
    await expect(element).toHaveNoViolations()
}
