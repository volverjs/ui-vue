import { VvTableProps } from '@/components/VvTable'
import { ModifiersArgTypes } from '@/stories/argTypes'

export const defaultArgs = {
	...propsToObject(VvTableProps),
	columns: [
		{
			name: 'Firstname',
			field: 'firstname',
			label: 'First name',
		},
		{
			name: 'Lastname',
			field: 'lastname',
			label: 'Last name',
		},
		{
			name: 'Age',
			field: 'age',
			label: 'Age',
		},
	],
	data: [
		{
			firstname: 'Mario',
			lastname: 'Rossi',
			age: 44,
		},
		{
			firstname: 'Luca',
			lastname: 'Pezzi',
			age: 38,
		},
	],
}

export const argTypes = {
	modifiers: {
		...ModifiersArgTypes.modifiers,
	},
}
