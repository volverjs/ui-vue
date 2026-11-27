import type { EffectScope, Ref } from 'vue'
import { effectScope, onScopeDispose, ref, toRaw, unref, watch } from 'vue'
import { StorageType } from '@/constants'

function getStorage(storageType: `${StorageType}` | undefined) {
    return storageType === StorageType.session ? sessionStorage : localStorage
}

export function usePersistence<T>(storageKey: Ref<string | undefined> | undefined,	storageType: Ref<`${StorageType}`> | `${StorageType}` = StorageType.local,	defaultValue?: T) {
    // A copy of the default taken before anything changes it: every key starts
    // `useStorage` from a fresh one, which picks the serializer, as at the
    // first mount, and is what a key emptied from another tab falls back to.
    // The value of the previous key picked a serializer of its own type, so a
    // string model of `VvAccordionGroup` was written bare and lost at the
    // next mount, and a key emptied elsewhere got the previous history back.
    const pristine = defaultValue === undefined
        ? undefined
        : structuredClone(toRaw(defaultValue))
    const getDefault = () => (pristine === undefined ? pristine : structuredClone(pristine)) as T

    const localValue: Ref<T | undefined> = ref()
    if (defaultValue) {
        localValue.value = defaultValue
    }
    let storageValue: Ref<T | undefined> | undefined

    // Every key, in every storage, gets a `useStorage` of its own, in a scope
    // stopped when the key or the storage changes and when the component goes.
    // Started from a watcher, outside any scope, the one of a previous key
    // kept watching the value it shared with the next one, and wrote it back
    // under the previous key at every change. It writes at once (`sync`), so
    // a change made in the same tick as a new key is not lost with the scope.
    // After a write it holds still until the next tick, as it hears its own
    // storage event: change the value once a tick, replacing it when several
    // things change, or only the first change is written.
    // A write under the same key from elsewhere, another component or another
    // tab, replaces the value of the storage, and the local value follows it:
    // with the copy taken at the bind, the next change here wrote back what
    // that write had removed, such as a password taken out of a history.
    let storageScope: EffectScope | undefined
    function bindStorage(key: string | undefined, storage: Storage) {
        storageScope?.stop()
        storageScope = undefined
        storageValue = undefined
        if (!key) {
            return
        }
        // a key with nothing stored starts from the current value
        const carried = storage.getItem(key) === null ? localValue.value : undefined
        storageScope = effectScope(true)
        storageValue = storageScope.run(() => {
            const value = useStorage(key, getDefault, storage, { flush: 'sync' })
            watch(value, (newValue) => {
                localValue.value = newValue
            }, { flush: 'sync' })
            return value
        }) as Ref<T | undefined>
        if (carried !== undefined) {
            storageValue.value = carried
        }
        localValue.value = storageValue.value
    }
    onScopeDispose(() => storageScope?.stop())

    onMounted(() => {
        watch(
            () => [storageKey?.value, unref(storageType)] as const,
            ([newKey, newType], oldValues) => {
                const [oldKey, oldType] = oldValues ?? []
                // the same key moving to the other storage takes its value
                const isMove = !!newKey && newKey === oldKey && !!oldType && oldType !== newType
                const value = localValue.value
                // A key that changes leaves the item of the previous one in
                // the storage: another field with the same key may be using it.
                bindStorage(newKey, getStorage(newType))
                if (isMove && storageValue) {
                    storageValue.value = value
                    localValue.value = value
                    getStorage(oldType).removeItem(newKey)
                }
            },
            {
                immediate: true,
            },
        )
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
