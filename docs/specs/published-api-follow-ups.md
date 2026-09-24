# Published API: follow-ups

> **Status**: Open.
> **Date**: 2026-09-24
> **Scope**: Defects found while making the declarations of 0.0.24 resolve in an application and naming the fields of the json-render catalog, and left out of that work because each one changes more than it fixes on its own. Each one is described with the evidence, the impact and a proposal, so they can be picked up separately.

---

## 1. `VvNav` promises the keyboard model of a menu

**What happens.** The list is `role="menu"`, each item `role="menuitem"` inside a `role="presentation"` item. A menu, per the ARIA practices, is a widget: the arrow keys move between its items, Home and End reach the ends, and Tab leaves it as a single stop. `VvNav` has none of it, so every item is its own tab stop and the arrows do nothing, while assistive technology announces a menu and tells the user to use them.

**Evidence.** [`VvNav.vue`](../../src/components/VvNav/VvNav.vue) and [`VvNavItem.vue`](../../src/components/VvNav/VvNavItem.vue). The accessibility check of the stories does not flag it, since the roles are valid, only unfulfilled. `VvTab` builds on `VvNav`.

**Impact.** Every sidebar, aside and tab bar drawn with `VvNav`. The links themselves work from the keyboard: a `Keyboard` story shows Enter and Space reaching the `click` event.

**Proposal.** For navigation, the pattern the practices recommend is a list of links inside `<nav>` with no menu roles at all: drop the three roles. `VvTab` then needs its own roles, `tablist`, `tab` and `tabpanel`, which is the keyboard model users expect there. Implementing the menu model instead is only right for a real application menu, which `VvNav` is not.

## 2. The declarations do not resolve with `moduleResolution: node16`

**What happens.** The package is `"type": "module"`, so its declarations are ES modules, and under `node16` or `nodenext` a relative import needs its file extension. The declarations import `./VvButton.vue` and `../../props` without one.

**Evidence.** `scripts/declarations.js` run with `NodeNext` for `module` and `moduleResolution` reports 262 errors: 196 TS2834, a relative import that needs an extension, and 66 TS2307, a module not found. With `bundler`, the resolution of an application built with Vite, there are none.

**Impact.** A project that resolves with `node16` or `nodenext`, a Node service or a library built with `tsc`, gets no types from the package, or `any` with `skipLibCheck`.

**Proposal.** Emit declarations whose relative imports carry the extension of the file they resolve to (`.js` for a module, `.vue.js` or a matching declaration for a component), for example by rewriting them in `scripts/declarations.js` as the aliases are, and run the check under both resolutions.

## 3. `dist` publishes the declarations of the stories and the tests

**What happens.** `generate-tsd` compiles with `tsconfig.json`, which includes `src/stories` and `src/test`, so `dist/stories` and `dist/test` hold about 700 KB of declarations that no consumer imports.

**Evidence.** `tsconfig.json`, `include`, and the `generate-tsd` script of `package.json`. `scripts/declarations.js` leaves them out of its check for that reason.

**Impact.** Package size only: the files are reachable through `./dist/*`, but nothing points at them.

**Proposal.** A `tsconfig.build.json` that extends `tsconfig.json` and excludes the stories and the tests, used by `generate-tsd` only, so the type check and the docgen of Storybook keep seeing them.
