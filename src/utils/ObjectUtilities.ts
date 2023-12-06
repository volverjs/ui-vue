import type { Ref } from 'vue'

/**
 * Compare objects, primitives, array, dates, regexp
 * @param {any} obj1 first literal
 * @param {any} obj2 second literal
 * @param {string} field optional field of obj1 and obj2 (also nested dotted field "prop1.prop12")
 * @returns {boolean}
 */
// eslint-disable-next-line
export function equals(obj1: any, obj2: any, field?: string) {
	if (field) {
		return resolveFieldData(obj1, field) === resolveFieldData(obj2, field)
	}
	return deepEquals(obj1, obj2)
}

/**
 * Compare objects, primitives, array, dates, regexp
 * @param {any} a first literal
 * @param {any} b second literal
 * @returns {boolean}
 */
// eslint-disable-next-line
export function deepEquals(a: any, b: any) {
	if (a === b) return true

	if (a && b && typeof a == 'object' && typeof b == 'object') {
		const arrA = Array.isArray(a)
		const arrB = Array.isArray(b)
		let i, length, key

		if (arrA && arrB) {
			length = a.length
			if (length != b.length) return false
			for (i = length; i-- !== 0; )
				if (!deepEquals(a[i], b[i])) return false

			return true
		}

		if (arrA != arrB) return false

		const dateA = a instanceof Date,
			dateB = b instanceof Date

		if (dateA != dateB) return false
		if (dateA && dateB) return a.getTime() == b.getTime()

		const regexpA = a instanceof RegExp,
			regexpB = b instanceof RegExp

		if (regexpA != regexpB) return false
		if (regexpA && regexpB) return a.toString() == b.toString()

		const keys = Object.keys(a)

		length = keys.length

		if (length !== Object.keys(b).length) return false

		for (i = length; i-- !== 0; )
			if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false

		for (i = length; i-- !== 0; ) {
			key = keys[i]
			if (!deepEquals(a[key], b[key])) return false
		}

		return true
	}

	return a !== a && b !== b
}

/**
 * Find and return field or nested field from object (also nested dotted field)
 * @param {object} data object that contains the field
 * @param {string} field ex: "prop1" or "prop1.prop12"
 * @returns {boolean}
 */
export function resolveFieldData(data: Record<string, unknown>, field: string) {
	if (data && Object.keys(data).length && field) {
		if (field.indexOf('.') === -1) {
			return data[field]
		} else {
			const fields = field.split('.')
			let value = data

			for (let i = 0, len = fields.length; i < len; ++i) {
				if (data == null) {
					return null
				}

				value = value[fields[i]] as Record<string, unknown>
			}

			return value
		}
	} else {
		return null
	}
}

/**
 * @param {any} obj data to check
 * @returns {boolean}
 */
// eslint-disable-next-line
export function isFunction(obj: any) {
	return !!(obj && obj.constructor && obj.call && obj.apply)
}

/**
 * Return the index of value in list array
 * @param {any} value the element to find
 * @param {Array<any>} list array list
 * @returns {number} the index
 */
export function findIndexInList<Type = unknown>(value: Type, list: Type[]) {
	let index = -1

	if (list) {
		for (let i = 0; i < list.length; i++) {
			if (equals(list[i], value)) {
				index = i
				break
			}
		}
	}

	return index
}

/**
 * Return the index of value in list array
 * @param {any} value the element to find
 * @param {Array<any>} list array list
 * @returns {boolean} the index
 */
export function contains<Type = unknown>(value: Type, list: Type[]) {
	if (value != null && list && list.length) {
		for (const val of list) {
			if (equals(value, val)) {
				return true
			}
		}
	}
	return false
}

/**
 * @param {boolean | string | null | undefined | number | Array<unknown> | object} value element to checj
 * @returns {boolean}
 */
export function isEmpty(
	value:
		| boolean
		| string
		| null
		| undefined
		| number
		| unknown[]
		| object
		| Ref,
) {
	return ((value) =>
		value === null ||
		value === undefined ||
		value === '' ||
		(Array.isArray(value) && value.length === 0) ||
		(!(value instanceof Date) &&
			typeof value === 'object' &&
			Object.keys(value).length === 0))(unref(value))
}

/**
 * Return the object entries that match the predicate passed
 * @param {Object} value
 * @param {Function} predicate
 * @returns {Object}
 */
export function pickBy(
	value: Record<string, unknown>,
	predicate: (k: string) => boolean,
) {
	return Object.fromEntries(
		Object.entries(value).filter(([key]) => predicate(key)),
	)
}

/**
 * Remove a value from an Array
 * @param {any} value the element to remove
 * @param {Array<any>} list
 * @returns {Array<any>}
 */
export function removeFromList<Type = unknown>(value: Type, list: Type[]) {
	//check off
	const indexElToRemove = findIndexInList(value, list)
	if (indexElToRemove > -1) {
		return list.filter((el, elIndex) => elIndex !== indexElToRemove)
	} else {
		return list
	}
}

/**
 * @param {any} value
 * @returns {boolean}
 */
export function isString(value: unknown) {
	return typeof value === 'string' || value instanceof String
}

/**
 * Convert props definition to object with "prop" as key and default as value
 * @param {ComponentObjectPropsOptions} props vue component props
 * @returns {Object}
 */
// eslint-disable-next-line
export function propsToObject(props: any) {
	return Object.keys(props).reduce(
		(accumulator: Record<string, unknown>, key: string) => {
			if (key === 'modelValue') {
				return accumulator
			}
			if ('default' in props[key]) {
				accumulator[key] =
					typeof props[key].default === 'function'
						? props[key].default()
						: props[key].default
				return accumulator
			}
			if (isFunction(props[key])) {
				// case prop1: String
				accumulator[key] = props[key]()
				return accumulator
			}
			if (Array.isArray(props[key])) {
				// case prop1: [ String, Array ]
				accumulator[key] = props[key][0]()
				return accumulator
			}
			// case prop1: { type: ... }
			if (Array.isArray(props[key].type)) {
				accumulator[key] = props[key]?.type[0]()
				return accumulator
			}
			// case prop1: { type: String }
			accumulator[key] = props[key]?.type()
			return accumulator
		},
		{} as Record<string, unknown>,
	)
}

/**
 * Filter array objects by filter array
 * @param {object[]} list the listo to filter
 * @param {object[] | string[]} filter the filter list, array of string or array of object
 * @param {string} key
 * @return {object[]}
 */
export function filterArray<T = Record<string, unknown>>(
	list: T[],
	filter: T[] | string[],
	key: string,
): T[] {
	return list.filter((el) => {
		return filter.some((f) => {
			return typeof f === 'string'
				? el[key as keyof typeof el] == f
				: equals(el[key as keyof typeof el], f[key as keyof typeof f])
		})
	})
}
