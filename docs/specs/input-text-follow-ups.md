# VvInputText: follow-ups

> **Status**: Closed: the three defects are fixed in 0.0.32.
> **Date**: 2026-11-26
> **Scope**: Defects found in the review of #199, which fixed the history of the suggestions and the dates of `VvInputText` for 0.0.30, and left out of it because each one changes more than that pull request fixes. Each one is described with the evidence, the impact and a proposal, so they can be picked up separately.

---

## 1. A time with milliseconds throws

**What happens.** With a `step` below one second (`0.5`, `0.001`) the value the browser gives a `time` or `datetime-local` field can carry milliseconds, `12:30:00.500`. `getDateFromInputValue` accepts `HH:mm` and `HH:mm:ss` only and throws on anything else, and `handleDateAccept` calls it from the `accept` of IMask whenever the model is a `Date` or an ISO string: the error is not caught and the model is not updated. `getInputValueFromDate` never writes milliseconds either, so the field cannot show those of the model.

**Evidence.** `TIME_REGEX` and `DATETIME_REGEX` in [`DateUtilities.ts`](../../src/utils/DateUtilities.ts), and `handleDateAccept` in [`VvInputText.vue`](../../src/components/VvInputText/VvInputText.vue). Found by reading in the review of #199, not reproduced in a story.

**Impact.** A `time` or `datetime-local` field with a fractional `step` only. `hasSeconds` already reads a step of `0.5` as one with seconds, so the case was meant to work.

**Proposal.** Accept `.sss` in both regular expressions, format the milliseconds in `getInputValueFromDate` when the step has a fraction, and compare at that precision in `mergeDateIntoModelValue`, with a story per type that edits the milliseconds.

**Resolution.** Fixed in 0.0.32 as proposed. The milliseconds are written only when they are not 0, as the browser writes whole seconds, so `min` and `max` of a fractional step keep their form. `TypeTimeMilliseconds` and `TypeDateTimeMilliseconds` cover it.

## 2. A storage key changed while the field is mounted

**What happens.** `usePersistence` opens a new `useStorage` on every key and never stops the previous one, whose deep watcher still holds the `Set` it shares with the new one: a value added after the change may be written under the old key as well. It also removes the item of the old key, which another field with the same `name` may be using. Since #199 the key `forceInputSuggestions` gives a `VvInputText` follows its `type`, so a `type` prop moved between `text` and `password` changes the key too.

**Evidence.** [`usePersistence.ts`](../../src/composables/usePersistence.ts). A hypothesis from reading, not reproduced.

**Impact.** A `VvInputText`, `VvTextarea` or `VvAccordionGroup` whose `storageKey`, or whose `name` or `type` under `forceInputSuggestions`, changes while it is mounted.

**Proposal.** Run each `useStorage` in an effect scope of its own and stop it on a key change, start the new one with a copy of the set, and add a story that changes the key and checks both items of the storage.

**Resolution.** Fixed in 0.0.32. Each key runs in a scope stopped on a change of key or `storageType` and on unmount, and writes at once; the copy proved unnecessary once the previous storage stops. A key change no longer removes the item of the previous key. The review of the fix also found that the storage of a new key took its serializer from the value of the previous one, so a string model of `VvAccordionGroup` was written bare: every key now starts from a fresh copy of the default of the component. A new key with nothing stored still starts from the previous value, and a change of `storageType` alone still moves the key. `StorageKeyChange` of `VvInputText` covers both halves, and `StorageKeyChange` of `VvAccordionGroup` the serializer.

## 3. A password shown by changing `type`

**What happens.** `forceInputSuggestions` keeps no history of a `password` field, but an application that shows the password by moving the `type` prop to `text`, instead of using the toggle of the field, gives it a key while it is `text`: a blur in that state stores the password in clear. The toggle of the field changes the type it renders, not the prop, and is not affected.

**Evidence.** `storageKey` in [`VvInputText.vue`](../../src/components/VvInputText/VvInputText.vue) reads the `type` prop.

**Impact.** An application with `forceInputSuggestions` and a show-password control of its own.

**Proposal.** Document the toggle of the field as the way to show a password, or keep a field that was mounted as a `password` out of the forced history for as long as it is mounted.

**Resolution.** Fixed in 0.0.32 with the second option, extended to a field that becomes a `password` after it is mounted. A field mounted as `text` keeps a history until then, and removes the values it stored when it becomes a `password`: without that, the fix of item 2, which leaves the item of a previous key in place, kept the password typed while shown. Two fields swapped with `v-if` or a `key` stay two fields, which the JSDoc of `forceInputSuggestions` now says. `ForcedSuggestionsShownPassword` and `ForcedSuggestionsMountedShownPassword` cover it.
