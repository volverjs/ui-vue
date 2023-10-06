export type Nullable<T> = T | null | undefined

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Option = Record<string | number | symbol, any> & {
	options?: Option[]
}
