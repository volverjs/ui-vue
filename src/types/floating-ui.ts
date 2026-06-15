import type { autoPlacement, flip, offset, shift, size } from '@floating-ui/vue'

export type { MiddlewareState } from '@floating-ui/core'
export type { Middleware } from '@floating-ui/vue'

/**
 * Drop the `Derivable` (callback) variant from a floating-ui option type.
 * The components only ever pass plain option objects, and keeping the
 * callback variant leaks non-portable floating-ui internals
 * (`Derivable`, `MiddlewareState`) into the emitted declaration files.
 */
type NonDerivable<T> = Exclude<T, (...args: never[]) => unknown>

export type AutoPlacementOptions = NonDerivable<Parameters<typeof autoPlacement>[0]>
export type FlipOptions = NonDerivable<Parameters<typeof flip>[0]>
export type ShiftOptions = NonDerivable<Parameters<typeof shift>[0]>
export type OffsetOptions = NonDerivable<Parameters<typeof offset>[0]>
export type SizeOptions = NonDerivable<Parameters<typeof size>[0]>
