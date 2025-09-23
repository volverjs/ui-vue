function acceptedMimeTypes(acceptValue?: string) {
    // Arrays to store MIME types and accepted extensions
    const mimeTypes: string[] = []
    const extensions: string[] = []
    const wildcards: string[] = []

    // Parse restrictions from the accept attribute
    const acceptedTypes: string[] | undefined = acceptValue?.split(',').map(type => type.trim().toLowerCase())

    if (acceptedTypes?.length) {
    // Categorize restrictions
        acceptedTypes.forEach((type: string) => {
            if (type.startsWith('.')) {
            // It's an extension (.jpg, .png, etc.)
                extensions.push(type)
            } else if (type.includes('/*')) {
            // It's a MIME type wildcard (image/*, video/*, etc.)
                wildcards.push(type.replace('/*', ''))
            } else {
            // It's a specific MIME type (image/jpeg, application/pdf, etc.)
                mimeTypes.push(type)
            }
        })
    }

    return {
        mimeTypes,
        extensions,
        wildcards,
    }
}

/**
 * Validates if all files in a FileList meet the restrictions of the accept attribute
 * @param {FileList} fileList - The FileList object to validate
 * @param {string} [acceptValue] - The value of the accept attribute (e.g. ".jpg,.png,image/*")
 * @returns {boolean} - true if all files are valid, false otherwise
 */
export function validateFileList(fileList: FileList, acceptValue?: string): boolean {
    // If there are no restrictions, accept any file
    if (!acceptValue || acceptValue.trim() === '' || acceptValue === '*') {
        return true
    }

    // Arrays to store MIME types and accepted extensions
    const { mimeTypes, extensions, wildcards } = acceptedMimeTypes(acceptValue)

    // Check each file
    for (const file of fileList) {
        const fileType = file.type.toLowerCase()
        const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`

        // Check MIME type
        const mimeMatches: boolean = mimeTypes.includes(fileType)

        // Check wildcards
        const wildcardMatches: boolean = wildcards.some(wildcard => fileType.startsWith(`${wildcard}/`))

        // Check extension
        const extensionMatches: boolean = extensions.some(ext => fileExtension === ext.toLowerCase())

        // If the file doesn't match any restrictions, the FileList is not valid
        if (!mimeMatches && !wildcardMatches && !extensionMatches) {
            return false
        }
    }

    // All files meet the restrictions
    return true
}

/**
 * Filters a FileList and returns only the files that match the accept attribute criteria
 * @param {FileList} fileList - The FileList object to filter
 * @param {string} [acceptValue] - The value of the accept attribute (e.g. ".jpg,.png,image/*")
 * @returns {File[]} - Array of files that match the accept criteria
 */
export function filterFileList(fileList: FileList, acceptValue?: string): File[] {
    // If there are no restrictions, return all files
    if (!acceptValue || acceptValue.trim() === '' || acceptValue === '*') {
        return Array.from(fileList)
    }

    // Arrays to store MIME types and accepted extensions
    const { mimeTypes, extensions, wildcards } = acceptedMimeTypes(acceptValue)

    // Filter files based on the criteria
    return Array.from(fileList).filter((file) => {
        const fileType: string = file.type.toLowerCase()
        const fileExtension: string = `.${file.name.split('.').pop()?.toLowerCase()}`

        // Check MIME type
        const mimeMatches: boolean = mimeTypes.includes(fileType)

        // Check wildcards
        const wildcardMatches: boolean = wildcards.some(wildcard => fileType.startsWith(`${wildcard}/`))

        // Check extension
        const extensionMatches: boolean = extensions.some(ext => fileExtension === ext.toLowerCase())

        // Return true if the file matches any of the criteria
        return mimeMatches || wildcardMatches || extensionMatches
    })
}
