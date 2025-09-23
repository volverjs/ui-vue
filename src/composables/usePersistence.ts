import type { Ref } from 'vue'
import { isRef, ref, unref, watch } from 'vue'
import { StorageType } from '@/constants'

export function usePersistence<T>(storageKey: Ref<string | undefined> | undefined,	storageType: Ref<`${StorageType}`> | `${StorageType}` = StorageType.local,	defaultValue?: T) {
    const localValue: Ref<T | undefined> = ref()
    if (defaultValue) {
        localValue.value = defaultValue
    }
    let storageValue: Ref<T | undefined> | undefined
    onMounted(() => {
        if (storageKey) {
            watch(
                storageKey,
                (newKey, oldKey) => {
                    const storage
                        = unref(storageType) === StorageType.session
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
                        if (storageValue.value) {
                            localValue.value = storageValue.value
                        }
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
                        const storage
                            = newType === StorageType.session
                                ? sessionStorage
                                : localStorage
                        storageValue = useStorage(
                            storageKey.value,
                            storageValue?.value ?? localValue.value,
                            storage,
                        )
                    }
                    if (oldType && oldType !== newType) {
                        const oldStorage
                            = oldType === StorageType.session
                                ? sessionStorage
                                : localStorage
                        oldStorage.removeItem(storageKey.value)
                    }
                }
            })
        }
    })

    watch(localValue, (newValue) => {
        if (storageValue) {
            storageValue.value = newValue
        }
    }, {
        deep: true,
        immediate: true,
    })

    return localValue
}
