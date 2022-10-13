import type { InjectionKey } from 'vue'
import type { IGroupState } from './composables/group/types'

export const VV_BUTTON_GROUP: InjectionKey<
	IGroupState<Object | String | Number | Boolean>
> = Symbol('VV_BUTTON_GROUP')
export const VV_RADIO_GROUP: InjectionKey<
	IGroupState<Object | String | Number | Boolean>
> = Symbol('VV_RADIO_GROUP')
export const VV_CHECK_GROUP: InjectionKey<
	IGroupState<
		| Object[]
		| Object
		| String
		| String[]
		| Number[]
		| Number
		| Boolean[]
		| Boolean
	>
> = Symbol('VV_CHECK_GROUP')
