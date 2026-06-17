export function findScrollContainer(element: HTMLElement | null) {
    if (!element) {
        return undefined
    }
    let parent = element.parentElement
    while (parent) {
        const { overflow } = globalThis.getComputedStyle(parent)
        if (overflow.split(' ').every(item => item === 'auto' || item === 'scroll')) {
            return parent
        }
        parent = parent.parentElement
    }

    return document.documentElement
}
