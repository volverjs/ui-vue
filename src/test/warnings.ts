import { mocked, spyOn } from 'storybook/test'

/**
 * A story `beforeEach` that records `console.warn` instead of printing it.
 * Vue checks a prop while it creates the component, before the play function
 * runs, so the spy has to be in place before the story mounts.
 */
export function recordWarnings() {
    const warn = spyOn(console, 'warn').mockImplementation(() => {})
    return () => warn.mockRestore()
}

/** The warnings Vue wrote for a prop whose validator refused its value. */
export function invalidPropWarnings(prop: string) {
    return mocked(console.warn).mock.calls.filter(([message]) =>
        String(message).includes(`custom validator check failed for prop "${prop}"`),
    )
}
