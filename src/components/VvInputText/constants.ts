const TYPES = {
	TEXT: 'text',
	PASSWORD: 'password',
	DATE: 'date',
	DATETIME_LOCAL: 'datetime-local',
	NUMBER: 'number',
	TIME: 'time',
	EMAIL: 'email',
	TEL: 'tel',
	URL: 'url',
	COLOR: 'color',
	SEARCH: 'search',
	FILE: 'file'
}

const ICON_POSITIONS = {
	LEFT: 'left',
	RIGHT: 'right'
}

const TYPES_ICON = {
	PASSWORD_ON: 'eye-on',
	PASSWORD_OFF: 'eye-off',
	DATE: 'calendar',
	TIME: 'time',
	COLOR: 'color',
	SEARCH: 'search'
}

const EVENTS = ['update:modelValue', 'focus', 'blur', 'input']

export default {
	TYPES,
	ICON_POSITIONS,
	TYPES_ICON,
	EVENTS
}
