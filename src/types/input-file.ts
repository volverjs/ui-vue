export type UploadedFile<Source = unknown>
    = {
        name: string
        size: number
        type: string
        url?: string
        thumbnailUrl?: string
        lastModified?: number
        source?: Source
    }
