export type Nullable<T> = T | null | undefined

export type Option = Record<string | number | symbol, unknown> & {
	options?: Option[]
}
