import { defineRegistry } from '@json-render/vue'
import { catalog } from './catalog'
import { volverComponents } from './components'

/**
 * Pre-built json-render registry mapping all curated Volver catalog types
 * to their Vue component implementations.
 *
 * Use with the `<Renderer>` component from `@json-render/vue` to render
 * AI-generated specs using Volver UI components.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import {
 *   Renderer,
 *   StateProvider,
 *   VisibilityProvider,
 *   ActionProvider,
 * } from '@json-render/vue'
 * import { registry } from '@volverjs/ui-vue/json-render'
 * import type { Spec } from '@json-render/vue'
 *
 * const spec = ref<Spec | null>(null)
 * </script>
 *
 * <template>
 *   <StateProvider :initial-state="{}">
 *     <VisibilityProvider>
 *       <ActionProvider :handlers="{}">
 *         <Renderer :spec="spec" :registry="registry" />
 *       </ActionProvider>
 *     </VisibilityProvider>
 *   </StateProvider>
 * </template>
 * ```
 */
export const { registry } = defineRegistry(catalog, {
    components: volverComponents as any,
})
