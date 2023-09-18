import { uid } from 'uid'
import type { Ref } from 'vue'

export const useUniqueId = (id?: Ref<string | number | undefined>) =>
	computed(() => String(id?.value || uid()))
