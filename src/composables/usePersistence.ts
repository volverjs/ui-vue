import type { EffectScope, Ref } from 'vue'
import { effectScope, isRef, onScopeDispose, ref, unref, watch } from 'vue'
import { StorageType } from '@/constants'

function getStorage(storageType: `${StorageType}` | undefined) {
    return storageType === StorageType.session ? sessionStorage : localStorage
}

export function usePersistence<T>(storageKey: Ref<string | undefined> | undefined,	storageType: Ref<`${StorageType}`> | `${StorageType}` = StorageType.local,	defaultValue?: T) {
    const localValue: Ref<T | undefined> = ref()
    if (defaultValue) {
        localValue.value = defaultValue
    }
    let storageValue: Ref<T | undefined> | undefined

    // Every key, in every storage, gets a `useStorage` of its own, in a scope
    // stopped when the key or the storage changes and when the component goes.
    // Started from a watcher, outside any scope, the one of a previous key
    // kept watching the value it shared with the next one, and wrote it back
    // under the previous key at every change.
    let storageScope: EffectScope | undefined
    function bindStorage(key: string | undefined, storage: Storage) {
        storageScope?.stop()
        storageScope = undefined
        // a new key starts from the value of the previous one when it has none
        const previousValue = storageValue?.value ?? localValue.value
        storageValue = undefined
        if (!key) {
            return
        }
        storageScope = effectScope(true)
        storageValue = storageScope.run(() =>
            useStorage(key, previousValue, storage),
        ) as Ref<T | undefined>
        if (storageValue.value) {
            localValue.value = storageValue.value
        }
    }
    onScopeDispose(() => storageScope?.stop())

    onMounted(() => {
        if (storageKey) {
            // A key that changes leaves the item of the previous one in the
            // storage: another field with the same key may be using it.
            watch(
                storageKey,
                newKey => bindStorage(newKey, getStorage(unref(storageType))),
                {
                    immediate: true,
                },
            )
        }
        if (isRef(storageType)) {
            watch(storageType, (newType, oldType) => {
                const key = storageKey?.value
                if (!key) {
                    return
                }
                // the same key moves to the other storage, with its value
                const value = storageValue?.value ?? localValue.value
                bindStorage(key, getStorage(newType))
                if (storageValue) {
                    storageValue.value = value
                    localValue.value = value
                }
                if (oldType && oldType !== newType) {
                    getStorage(oldType).removeItem(key)
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
