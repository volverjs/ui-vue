export type UploadedFile<Source = undefined> = Source extends undefined
	? {
			name: string
			size: number
			type: string
			url: string
			thumbnailUrl?: string
			lastModified?: number
		}
	: {
			name: string
			size: number
			type: string
			url: string
			thumbnailUrl?: string
			lastModified?: number
			source: Source
		}
