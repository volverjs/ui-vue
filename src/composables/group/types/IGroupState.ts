import type { Ref } from 'vue'

/**
 * State shared for a group of elements
 */
export default interface IGroupState {
	[itemKey: string]: Ref<unknown> | string
	// The key of the group
	key: string
}
