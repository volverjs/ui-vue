# Vue components for the new blocks of @volverjs/style

> **Status**: Partial (phase 0 and wave 1 implemented: the bump to 0.1.31, `itemModifiers` on the groups, the stories of the new modifiers, `VvSpinner`, `VvSeparator`, `VvEmpty`, `VvSkeleton`, `VvKbd`, `VvMarker`)
> **Date**: 2026-10-13
> **Scope**: The counterparts in this library of the blocks `@volverjs/style` added in 0.1.30 and 0.1.31, plus `vv-skeleton` and `vv-table`, which were already there, and the changes the two releases ask of the components that exist: the behaviour, the ARIA and the props that each block leaves to a script.
> **Related specs**: [`floating-elements.md`](./floating-elements.md) (the top layer, which `VvPopover` builds on), [`published-api-follow-ups.md`](./published-api-follow-ups.md) (the roles of `VvNav`, which `VvSidebar` holds)

## Overview

`@volverjs/style` 0.1.30 (2026-10-07) added 23 blocks, and 0.1.31 (2026-10-12) added open and close transitions on the native elements. The spec behind them, `docs/specs/missing-components.md` in the style repository, measured the library against the shadcn/ui catalogue and ranked the gap by what 8bot, a product built on both libraries, had to write for itself. It leaves the Vue side out on purpose ("each new block gets its counterpart there, in a spec of that repository"), together with every behaviour: focus management, keyboard navigation, sticking to the latest message, date arithmetic. This is that spec.

This library develops against `@volverjs/style` 0.1.29 and asks `>=0.1.28` of its consumers. The blocks with no component here:

| Released in | Blocks |
| --- | --- |
| 0.1.30 | `vv-empty`, `vv-separator`, `vv-spinner`, `vv-kbd`, `vv-kbd-group`, `vv-item`, `vv-item-group`, `vv-field`, `vv-prose`, `vv-pagination`, `vv-popover`, `vv-sidebar`, `vv-input-otp`, `vv-command`, `vv-calendar`, `vv-message`, `vv-bubble`, `vv-bubble-group`, `vv-message-scroller`, `vv-attachment`, `vv-attachment-group`, `vv-marker`, `vv-questionnaire` |
| Earlier | `vv-skeleton`, `vv-table`, `vv-text` |

The same releases changed blocks that have a component:

- `vv-radio` and `vv-checkbox` gain `segment` and `card`, their groups `segmented` and `cards`.
- `vv-dialog` gains `drawer-start`, `drawer-top` and `drawer-bottom`, with the `slide-inline-start`, `slide-block-start` and `slide-block-end` transitions.
- `vv-accordion` animates its `::details-content`, and a `vv-dialog` opened with `showModal()` fades in through its own CSS.
- The current item of `vv-nav--sidebar` is inverted.

The evidence for the order is the same as upstream. 8bot (`8bot-ai-monorepo/packages/components/src`, on `@volverjs/style` 0.1.31 and `@volverjs/ui-vue` 0.0.24) carries Vue components for most of these blocks: `table/PkPagination.vue`, `table/PkTableSortable.vue`, `table/PkTableEmpty.vue`, `PkLoader.vue`, `PkSkeleton.vue`, `PkFieldset.vue`, `PkEditorRadioButtons.vue`, `PkEditorCheckboxButtons.vue`, and the conversation under `chat/` (`PkChatbotMessages.vue`, `PkChatbotFilePreview.vue`, `PkMessageParts.vue`). Each wave below starts from the 8bot component it replaces, and 8bot deletes its copy after the release that ships it.

One defect is already visible there. `PkEditorRadioButtons` draws its `VvRadio` children by hand instead of passing `options` to `VvRadioGroup`, because a group cannot hand a modifier to the options it draws: `segmented` on the group without `segment` on each option is a recessed track holding plain radios.

## Goals and non-goals

- **Goals**:
  - The components that exist take the new modifiers, the options a group draws from `options` included.
  - A component for each new block that has a behaviour, ARIA of its own or a structure worth not repeating, with stories and play tests, a json-render entry where a generated interface needs one, and an entry in the skill and in the changelog.
  - 8bot can replace its local components with these after each release, with no visible change.
- **Non-goals**:
  - CSS. Nothing here declares a style that `@volverjs/style` does not ship: a gap found on the way is a change there, in its own pull request.
  - A component for `vv-prose` and `vv-text`: a class on the container is their whole API.
  - A date library. `VvCalendar` works on `Date` and `Intl`.
  - A hover card, which the style spec dropped, and the reasoning disclosure of 8bot, which stays product specific.
  - The default of `topLayer` on `VvDropdown`, tracked in [`floating-elements.md`](./floating-elements.md).

## Design

### What every new component carries

The definition of done of `AGENTS.md`, and:

- `src/components/Vv<Name>/index.ts` (props with JSDoc, events), `src/components/Vv<Name>/Vv<Name>.vue`, and the export in `src/components/index.ts`. `scripts/build.js` globs `src/components/**/!(_*).vue`, so the `./vv-<name>` subpath of `exports` comes with the build, and `scripts/declarations.js` compiles its declarations.
- An entry in `getStyleNames` of `src/resolvers/unplugin.ts` when the component renders more than its own block (`VvItemGroup` renders `vv-item`, `VvKbd` renders `vv-kbd-group`), so that `importStyle` loads every file it needs.
- Stories in `src/stories/<Name>/` (`<Name>.stories.ts`, `<Name>.test.ts`, `<Name>.settings.ts`), each play test ending on `toHaveNoViolations`.
- Modifiers through `useModifiers`. States go on the DOM, where the style reads them: `aria-pressed`, `aria-selected`, `aria-current`, `aria-sort`, `disabled`. `current` is the exception, a class, as on `VvNav`.
- Where a generated interface needs it, a definition in `src/json-render/definitions.ts`, its renderer in `src/json-render/components.ts`, and its entry in the catalog.
- `skills/volverjs-ui-vue/SKILL.md`: the catalog of section 2 and the modifier table of section 4.

### Phase 0: 0.1.31 and the components that exist

- `@volverjs/style` to 0.1.31 in `devDependencies` (`package.json`, `pnpm-lock.yaml`). The peer floor stays at `>=0.1.28`: the new modifiers do nothing on an older style and break nothing. It rises to `>=0.1.30` with the first release that ships a component for a block of 0.1.30.
- `itemModifiers` on `VvRadioGroup` and `VvCheckboxGroup`, in `CheckboxRadioGroupProps` of `src/props/index.ts`. The groups provide it through `InputGroupState` (`src/types/group.ts`), and the options merge it with their own in `useGroupProps` of `src/components/VvRadio/index.ts` and `src/components/VvCheckbox/index.ts`, as `VvButtonGroup` and `VvAccordionGroup` already do for their items. `segment` is not derived from `segmented`: the style asks for both classes, and the two existing groups ask for both props.

  ```vue
  <VvRadioGroup v-model="view" name="view" modifiers="segmented" item-modifiers="segment" :options="views" />
  ```

  The catalog takes `itemModifiers` on `RadioGroup` and `CheckboxGroup`, and describes the two pairs.
- Stories: `segmented` and `cards` for both groups. The segmented play test moves the choice with the arrow keys and checks the accessibility of an option whose input is not painted. A card draws its title and description through the default slot of the option, as in the style documentation.
- `VvDialog`: a story for each drawer, `drawer`, `drawer-start`, `drawer-top` and `drawer-bottom`, with its `slide-*` transition, and the seven transitions in the `transition` control of `src/stories/Dialog/Dialog.settings.ts`.
- What 0.1.31 changes in the stories that exist, checked in Chromium: `VvAccordion` grows and shrinks its content, `VvDialog` does not fade in twice (once through its CSS, once through the Vue transition), and the current item of `vv-nav--sidebar` reads as chosen.
- `skills/volverjs-ui-vue/SKILL.md`: the modifier table regenerated with `scripts/list-modifiers.sh` against 0.1.31, and the recipe of the two pairs.

### Wave 1: blocks with no behaviour

| Component | Block | Props and slots | What the component adds |
| --- | --- | --- | --- |
| `VvSpinner` | `vv-spinner` | `label`, `decorative` | `role="status"` named by `label` when it stands alone, `aria-hidden="true"` with `decorative`, when a visible text sits next to it |
| `VvSeparator` | `vv-separator` | `label`, default slot, `vertical` | `<hr>` without a label, `role="separator"` with `aria-orientation` when vertical; with a label, no separator role, since the children of a separator are presentational and the label would not be read |
| `VvEmpty` | `vv-empty` | `title`, `description`, `icon`, `titleTag` (a paragraph by default); slots `media`, `title`, `description`, and the default slot as the actions | the structure, each part drawn only when given |
| `VvSkeleton` | `vv-skeleton` | `loading`, `items`, `itemClass`, `label`; slots `skeleton` and default (the content) | the bars in place of the content it wraps, as `PkSkeleton` does, and a `role="status"` named by `label` while loading |
| `VvKbd` | `vv-kbd`, `vv-kbd-group` | `keys` (a string or an array), `separator` | one `kbd` per key, the group when there is more than one |
| `VvMarker` | `vv-marker` | `label`, `icon`, default slot; the `bordered` modifier | the structure (it belongs to the conversation family, but has no behaviour) |

`VvButton` keeps its `loadingIcon`. Drawing its loading state with `VvSpinner` changes how every loading button looks, so it is an open decision rather than part of this wave.

### Wave 2: lists and data

- **`VvItem`, `VvItemGroup`** (from 8bot's `.u-pick-list`, used in 16 files).
  - `VvItem`: the `entry` is a `VvAction`, so `to` and `href` make it a link. Props `title`, `description`, `note`, `pressed`, `current`, `disabled`; slots `media`, `default` (the content), `actions`; the modifiers `roomy`, `top`, `plain`. An `open` event and its button (`vv-item__open`) for a row that opens a level while the entry chooses it.
  - `VvItemGroup`: the selection, single or `multiple`, as `v-model`, provided to the rows through a group state as the other groups do; `options` through `useOptions`; slots `header`, `empty` (a `VvEmpty` with `compact` by default) and `loading` (rows of skeleton bars); the modifiers `framed`, `fill`, `raised`.
- **`VvPagination`** (from `PkPagination`). `v-model:page`, `total`, `pageSize`, how many pages show around the current one and at the ends, an ellipsis where pages are skipped, previous and next disabled at the ends, `aria-current="page"`. Pages are buttons, or links when a function returns the `to` or the `href` of a page. A `summary` slot with `{ from, to, total }`.
- **`VvTable`** (from `PkTableSortable` and `PkTableEmpty`). A small data table rather than a bare wrapper, since that is what 8bot had to write.
  - Props: `columns` (`key`, `label`, `sortable`), `items`, `itemKey`, `caption`, `v-model:sort` (`{ key, order }`) and `current` (a key).
  - Slots: one per cell (`cell::<key>`), one per header (`header::<key>`), `empty` and `loading`.
  - What it adds: a sortable header is a `<button class="vv-table__sort">` inside a `th` that carries `aria-sort`, and the current row gets its class.
- **`VvField`**. The shell of a field around a control the library does not draw.
  - Props: `label`, the hint, valid, invalid and loading props of the other fields, `disabled`, `readonly`.
  - Slots: `before`, `after`, `toolbar`, and a default slot whose scope carries what the control needs (`id`, `aria-labelledby`, `aria-describedby`, `aria-invalid`, the `vv-field__control` class).
  - `VvFormField` of `@volverjs/form-vue` is checked against it before the API is final.

### Wave 3: overlays and the shell

- **`VvPopover`**.
  - A panel on the Popover API: `popover="auto"` gives the light dismiss and `Esc`, and its `toggle` event keeps `v-model` in step with a close the browser makes.
  - Positioned next to its trigger by floating-ui, with the placement props of `VvDropdown`, since anchor positioning is not baseline yet. Slots `trigger`, `title`, `default`, `footer`; the `center` modifier. Focus moves into the panel on open and goes back to the trigger on close.
  - `VvDropdown` stays for menus and lists.
- **`VvSidebar`**. `v-model:collapsed`, remembered through `usePersistence` when a key is given; slots `header`, `default` (the content) and `footer`. `collapsed` hides only what sits in `vv-sidebar__label`. Today `VvNavItem` (`src/components/VvNav/VvNavItem.vue`) leaves its text bare inside the `VvAction`, so `VvSidebar` provides itself and a `VvNavItem` inside one wraps its label in that element.
- **`VvInputOtp`**.
  - Props: `v-model` (a string), `length`, `groups` (`[3, 3]`), `separator`, `inputmode`, and the shared props of a field (`name`, `label`, the hint family, `invalid`, `disabled`).
  - Behaviour: a paste spreads over the slots, typing moves forward, `Backspace` moves back, and `autocomplete="one-time-code"` goes on the first slot.

### Wave 4: the conversation

Led by the move of the 8bot chat, widget included.

- **`VvMessage`**: `end`, `wide`, an avatar (the props of `VvAvatar`, or a slot), slots `header`, `meta`, `default`, `footer`.
- **`VvBubble`, `VvBubbleGroup`**: the bubble takes `end`, `plain` and its reactions (a slot, which sets `reacted`). The group provides `end` to its bubbles. The `--bubble-*` colours are documented in the skill, not exposed as props.
- **`VvMessageScroller`** (from `PkChatbotMessages`):
  - `role="log"` and `aria-live="polite"`.
  - It follows the latest message while the reader is at the bottom, stops when they scroll up, and shows the `jump` button until they are back.
  - `scrollToEnd()` is exposed, and the `fade` modifier is available.
- **`VvAttachment`** (from `PkChatbotFilePreview`): a `File` or a `src`, `name`, `size` and `type`; the preview of an image through an object URL revoked on unmount; `loading` with a `VvProgress`, `invalid`, and a `remove` event with its button. `vv-attachment-group` stays a class.
- **`VvQuestionnaire`**: the steps as `v-model:step`, the progress, the actions (previous, skip, next, submit), the choices drawn as radio and checkbox cards. Last of the wave, on request.

### Wave 5: command palette and calendar

- **`VvCommand`**.
  - The combobox pattern with `aria-activedescendant`: the focus stays in the search field while the arrows, `Home` and `End` move the active option. It filters, groups under headings, and draws shortcuts with `VvKbd`.
  - Inline, or in a `VvDialog` through a composable that opens it on a key combination.
  - Not built on `VvCombobox`, whose options take the focus: a different keyboard model.
- **`VvCalendar`**:
  - Behaviour: the month grid, a single day or a range, `min`, `max` and disabled days. Roving tabindex with the arrows, `PageUp` and `PageDown`, `Home` and `End`.
  - Locale: `Intl` names the months and weekdays, and gives the first day of the week where `Intl.Locale` exposes it.
  - DOM state: `aria-pressed` on the chosen days, `aria-current="date"` on today, `aria-selected` on the cells of a range.
  - A date picker (a field, a `VvPopover` and a `VvCalendar`) follows in its own spec.

### Decisions taken

- A component only where it adds behaviour, ARIA, structure or a catalog entry: `vv-prose`, `vv-text`, `vv-attachment-group` stay classes, and `vv-kbd-group` is drawn by `VvKbd`.
- `VvTable` is a small data table, not a bare wrapper.
- `itemModifiers` on the groups rather than deriving `segment` from `segmented`.
- Wave 1 in the json-render catalog: `Spinner`, `Separator`, `Empty` and `Kbd`. `VvSkeleton` stays out, since a generated interface has no loading state of its own, and so does `VvMarker`, which belongs to a conversation.
- Phase 0 and wave 1 ship in 0.0.25, then one release per wave.

### Open decisions

- `VvSpinner` as the loading state of `VvButton`.
- `VvPagination`: the page size inside the component, as in `PkPagination`, or a `VvSelect` beside it.
- `VvCalendar`: a `Date`, an ISO string or both as the model (`VvInputText` takes both).
- `VvPopover`: when anchor positioning becomes baseline, whether it replaces floating-ui.

## Rollout phases

Each item is one pull request from `develop`. Before it is done:

1. The four checks of `AGENTS.md` pass: `pnpm type-check`, `CI=true pnpm lint`, `pnpm test-storybook`, `pnpm build`.
2. The stories render in the light and the dark theme, with the play tests green.
3. The skill and the changelog are updated, and the json-render catalog where the component has an entry.
4. After the release, 8bot replaces its local component. That migration lives in the 8bot repository and does not block the next item here.

| Phase | Items | Release | Exit criterion |
| --- | --- | --- | --- |
| 0 | the bump, `itemModifiers`, the stories of the new modifiers, the checks of 0.1.31 | 0.0.25 | `PkEditorRadioButtons` and `PkEditorCheckboxButtons` can pass `options` |
| 1 | `VvSpinner`, `VvSeparator`, `VvEmpty`, `VvSkeleton`, `VvKbd`, `VvMarker` | 0.0.25 | 8bot deletes `PkLoader` and `PkTableEmpty` |
| 2 | `VvItem` and `VvItemGroup`, `VvPagination`, `VvTable`, `VvField` | 0.0.26 | 8bot deletes `PkPagination`, `PkTableSortable` and its pick lists |
| 3 | `VvPopover`, `VvSidebar`, `VvInputOtp` | 0.0.27 | the 8bot sidebar renders from `VvSidebar` |
| 4 | the conversation family | on request from 8bot | the 8bot chat, widget included, renders from these components |
| 5 | `VvCommand`, `VvCalendar` | on request | driven by demand |
