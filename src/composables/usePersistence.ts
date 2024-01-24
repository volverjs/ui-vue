import { StorageType } from '@/constants'

export const usePersistence = <T>(
	storageKey: Ref<string | undefined> | undefined,
	storageType: Ref<`${StorageType}`> | `${StorageType}` = StorageType.local,
	defaultValue?: T,
) => {
	const localValue: Ref<T | undefined> = ref()
	if (defaultValue) {
		localValue.value = defaultValue
	}
	let storageValue: Ref<T | undefined> | undefined
	if (storageKey) {
		watch(
			storageKey,
			(newKey, oldKey) => {
				const storage =
					unref(storageType) === StorageType.session
						? sessionStorage
						: localStorage
				if (oldKey && oldKey !== newKey) {
					storage.removeItem(oldKey)
				}
				if (newKey) {
					storageValue = useStorage(
						newKey,
						storageValue?.value ?? localValue.value,
						storage,
					)
					return
				}
				storageValue = undefined
			},
			{
				immediate: true,
			},
		)
	}
	if (isRef(storageType)) {
		watch(storageType, (newType, oldType) => {
			if (storageKey?.value) {
				if (newType) {
					const storage =
						newType === StorageType.session
							? sessionStorage
							: localStorage
					storageValue = useStorage(
						storageKey.value,
						storageValue?.value ?? localValue.value,
						storage,
					)
				}
				if (oldType && oldType !== newType) {
					const oldStorage =
						oldType === StorageType.session
							? sessionStorage
							: localStorage
					oldStorage.removeItem(storageKey.value)
				}
			}
		})
	}

	return computed<T | undefined>({
		get: () => {
			return storageValue?.value ?? localValue.value
		},
		set: (value) => {
			if (storageValue) {
				storageValue.value = value
				return
			}
			localValue.value = value
		},
	})
}
