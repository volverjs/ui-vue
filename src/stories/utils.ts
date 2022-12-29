type StorybookGroup = Record<string, unknown>

export function toGroup(keys: string[], categoryName: string) {
	return keys.reduce((acc, k) => {
		acc[k] = {
			table: {
				category: categoryName
			}
		}
		return acc
	}, {} as StorybookGroup)
}
