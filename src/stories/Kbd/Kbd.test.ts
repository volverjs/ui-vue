import type { PlayAttributes } from '@/test/types'
import { within } from 'storybook/test'
import { expect } from '@/test/expect'

export async function defaultTest({ canvasElement, args }: PlayAttributes) {
    const element = await within(canvasElement).findByTestId('element')
    const keys: string[] = Array.isArray(args.keys)
        ? args.keys
        : args.keys
            ? [args.keys]
            : []

    if (keys.length > 1) {
        // a combination is a group of keys, joined by the separator
        const caps = [...element.getElementsByTagName('kbd')]
        await expect(element).toHaveClass('vv-kbd-group')
        await expect(caps.map(cap => cap.textContent)).toEqual(keys)
        for (const cap of caps) {
            await expect(cap).toHaveClass('vv-kbd')
        }
        await expect(element.textContent).toBe(keys.join(args.separator ?? '+'))
    } else {
        // a single key is a cap of its own
        await expect(element.tagName).toBe('KBD')
        await expect(element).toHaveClass('vv-kbd')
        await expect(element.textContent?.trim()).toBe(keys[0] ?? args.default)
    }

    // check accessibility
    await expect(element).toHaveNoViolations()
}
