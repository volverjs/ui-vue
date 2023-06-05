import { VvTableProps } from '@/components/VvTable'
import { ModifiersArgTypes } from '@/stories/argTypes'

export const defaultArgs = {
	...propsToObject(VvTableProps),
	columns: [
		{
			name: 'firstname',
			field: 'firstname',
			label: 'First name',
			sortable: true,
		},
		{
			name: 'lastname',
			field: 'lastname',
			label: 'Last name',
			sortable: true,
		},
		{
			name: 'age',
			field: 'age',
			label: 'Age',
		},
	],
	data: [
		{
			firstname: '1 Mario',
			lastname: 'Rossi',
			age: 44,
		},
		{
			firstname: '2 Luca',
			lastname: 'Pezzi',
			age: 38,
		},
		{
			firstname: '3 Andrea',
			lastname: 'Verdi',
			age: 44,
		},
		{
			firstname: '4 Filippo',
			lastname: 'Neri',
			age: 38,
		},
		{
			firstname: '5 Mario',
			lastname: 'Rossi',
			age: 44,
		},
		{
			firstname: '6 Luca',
			lastname: 'Pezzi',
			age: 38,
		},
		{
			firstname: '7 Francesco',
			lastname: 'Bruno',
			age: 44,
		},
		{
			firstname: '8 Matteo',
			lastname: 'Ginetti',
			age: 38,
		},
		{
			firstname: '9 Marco',
			lastname: "D'amico",
			age: 44,
		},
		{
			firstname: '10 Luca',
			lastname: 'Pezzi',
			age: 38,
		},
		{
			firstname: '11 Filippo',
			lastname: 'Grazia',
			age: 38,
		},
	],
	sort: 'firstname',
	limit: 5,
	limitSteps: [5, 10],
	page: 1,
}

export const argTypes = {
	modifiers: {
		...ModifiersArgTypes.modifiers,
	},
}
