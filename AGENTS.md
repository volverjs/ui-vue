# Working on @volverjs/ui-vue

Vue 3 component library of the Volver design system. The components emit BEM
classes; the CSS comes from `@volverjs/style`.

## Setup

- Node `>=20.19`, and the pnpm version pinned in `packageManager`.
- `pnpm install --frozen-lockfile`, then `npx playwright install chromium` once:
  the tests run in a real browser.

## Definition of done

Run all of them before a commit, and report a skipped one as skipped:

1. `pnpm type-check`
2. `CI=true pnpm lint`. Without `CI=true`, a terminal inside an editor makes
   `@antfu/eslint-config` downgrade `unused-imports/no-unused-imports`,
   `prefer-const` and `test/no-only-tests` to warnings, so the lint passes
   here and fails in CI.
3. `pnpm test-storybook`. Every story with a `play` function is a test, run
   in Chromium. A folder alone: `pnpm test-storybook src/stories/Dialog`.
4. `pnpm build`. Its last step, `scripts/declarations.js`, compiles the
   published declarations of every entry point the way an application would,
   with `skipLibCheck` off, and fails on any error in them.

## Where things are

| What | Where |
|------|-------|
| Props with JSDoc, events | `src/components/Vv<Name>/index.ts` |
| Template, slots | `src/components/Vv<Name>/Vv<Name>.vue` |
| Shared props (`AriaProps`, `LabelProps`...) | `src/props/index.ts` |
| Stories, play tests, args | `src/stories/<Name>/<Name>.stories.ts`, `.test.ts`, `.settings.ts` |
| json-render catalog, the prompt the model reads | `src/json-render/definitions.ts` |
| json-render registry, what renders a spec | `src/json-render/components.ts` |
| Skill for the consumers of the library | `skills/volverjs-ui-vue/SKILL.md` |

## Conventions

- A fix comes with a story whose play test fails without the fix. Check
  accessibility with `await expect(element).toHaveNoViolations()`.
- The values of `vue` and `@vueuse/core`, and everything exported from
  `src/composables` and `src/utils`, are auto-imported. The types of Vue are
  not: import them (`import type { PropType } from 'vue'`). A global type would
  reach the published declarations as a name the consumers do not have.
- `auto-imports.d.ts` is committed, and `pnpm dev` rewrites it.
- `CHANGELOG.md`: the version at the top is the one in preparation, with
  user-facing entries under `Changed` and `Fixed`.
- A change to a prop, a slot or a catalog entry goes into
  `skills/volverjs-ui-vue/SKILL.md` too.

## Git

- Branch from `develop` and open the pull request on `develop`.
- Commits follow Conventional Commits, in English and with a scope:
  `fix(accordion-group): apply a model changed from outside`.
- A release:
  1. date its version in `CHANGELOG.md` on `develop`;
  2. open a `Release of vX.Y.Z` pull request from `develop` to `main`, and
     merge it with a merge commit, never a squash: a squash leaves `main` with
     a commit `develop` does not have, and every later release conflicts on it;
  3. tag `vX.Y.Z` on `main`. `release-tag.yml` creates the GitHub release, and
     the release runs `main.yml`, which publishes to npm and GitHub Packages.
