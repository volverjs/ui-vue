export type Nullable<T> = T | null | undefined

export type Option = {
	options?: Option[],
	[key: string]: unknown,
}
