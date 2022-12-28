import type { Ref } from 'vue'

/**
 * Stato condiviso per un gruppo di elementi
 */
export default interface IGroupState {
	[key: string]: Ref<unknown> | string
	/**
	 * Chiave usata per il provide del gruppo
	 */
	key: string
}
