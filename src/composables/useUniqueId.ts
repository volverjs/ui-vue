import { nanoid } from 'nanoid'
import type { Ref } from 'vue'

export const useUniqueId = (id?: Ref<string | number | undefined>) =>
	computed(() => String(id?.value || nanoid()))
