export interface IValid {
	valid: boolean
	validLabel: string | Array<string>
}

export interface IError {
	error: boolean
	errorLabel: string | Array<string>
}

export interface ILoading {
	loading: boolean
	loadingLabel: string
}

export interface IModifiers {
	modifiers: string | Array<string>
}

export interface IHint {
	hintLabel: string
}

export interface IOptions {
	options: Array<any>
	optionLabel: string | ((a: string) => void)
	optionValue: string | ((a: string) => void)
}
