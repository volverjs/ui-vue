import type { PlayAttributes } from '@/test/types'
import { within } from 'storybook/test'
import { expect } from '@/test/expect'
import { sleep } from '@/test/sleep'

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const firstChild = element.children[0] as HTMLDetailsElement
    const firstChildSummary = firstChild.getElementsByTagName('summary')[0]
    const value = await within(canvasElement).findByTestId('value')

    const modifiers
        = !args.modifiers || Array.isArray(args.modifiers)
            ? args.modifiers
            : [args.modifiers]

    expect(element).toHaveClass('vv-accordion-group')

    // modifiers
    if (modifiers) {
        for (const modifier of modifiers) {
            expect(element).toHaveClass(`vv-accordion-group--${modifier}`)
        }
    }

    // open
    if (!args.disabled && args.items && args.items.length > 0) {
        expect(firstChild.open).toBe(args.not ?? false)
        expect(firstChildSummary).toBeClicked()
        await sleep()
        expect(firstChild.open).toBe(!args.not)
        if (firstChild.open) {
            if (args.not) {
                expect(JSON.stringify(JSON.parse(value.textContent ?? ''))).toBe(
                    JSON.stringify(
                        args.items.map(
                            (item: { name: string }) => item.name,
                        ).toSpliced(0, 1),
                    ),
                )
            } else if (args.collapse) {
                expect(JSON.stringify(JSON.parse(value.textContent ?? ''))).toBe(
                    JSON.stringify([args.items[0].name]),
                )
            } else {
                expect(value.textContent ?? '').toBe(args.items[0].name)
            }
            expect(firstChildSummary.getAttribute('aria-expanded')).toBe('true')
            const content = firstChild.lastChild as HTMLElement
            expect(content.getAttribute('aria-hidden')).toBe('false')
        }
    }

    // accessibility
    await expect(element).toHaveNoViolations()
}
