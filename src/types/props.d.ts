export interface IValid {
	valid: boolean
	validLabel: string | array<string>
}

export interface IError {
	error: boolean
	errors: string | array<string>
}

export interface ILoading {
	loading: boolean
	loadingLabel: string
}

export interface IVariant {
	variant: string | array<string>
}
