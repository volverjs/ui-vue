export interface IValid {
	valid: boolean
	validLabel: string | array<string>
}

export interface IError {
	error: boolean
	errorLabel: string | array<string>
}

export interface ILoading {
	loading: boolean
	loadingLabel: string
}

export interface IModifiers {
	modifiers: string | array<string>
}

export interface IHint {
	hintLabel: string
}

export interface IOptions {
	options: array<any>
	optionLabel: string | ((a: string) => void)
	optionValue: string | ((a: string) => void)
}
