export function isDateIsoString(dateString: unknown) {
    if (typeof dateString !== 'string') {
        return false
    }
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(dateString)) {
        return false
    }
    const d = new Date(dateString)
    return !Number.isNaN(d.getTime()) && d.toISOString() === dateString
}

export function getInputValueFromDate(date: Date | string, typeOfInput: 'date' | 'time' | 'month' | 'datetime-local' = 'date', withSeconds?: boolean) {
    if (typeof date === 'string') {
        if (!isIsoDate(date)) {
            return ''
        }
    }
    const currentDate = new Date(date)
    const span = (num: number) => num.toString().padStart(2, '0')
    let toReturn = `${currentDate.getFullYear()}-${span(currentDate.getMonth() + 1)}`
    if (typeOfInput === 'month') {
        return toReturn
    }
    toReturn += `-${span(currentDate.getDate())}`
    if (typeOfInput === 'date') {
        return toReturn
    }
    const time = withSeconds
        ? `${span(currentDate.getHours())}:${span(currentDate.getMinutes())}:${span(currentDate.getSeconds())}`
        : `${span(currentDate.getHours())}:${span(currentDate.getMinutes())}`
    if (typeOfInput === 'time') {
        return time
    }
    return `${toReturn}T${time}`
}

/**
 * Converts an input string to a Date object based on input type
 * @param value - String value from input element
 * @param typeOfInput - Type of HTML input element
 * @returns Date object or null if invalid
 * @throws Error for invalid input format
 */
export function getDateFromInputValue(value: string, typeOfInput: 'date' | 'time' | 'month' | 'datetime-local' = 'date') {
    if (!value?.trim()) {
        return null
    }

    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth()
    const currentDate = today.getDate()

    if (typeOfInput === 'date') {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            throw new Error('Invalid date format. Expected: YYYY-MM-DD')
        }
        return new Date(`${value}T00:00:00`)
    }
    if (typeOfInput === 'month') {
        if (!/^\d{4}-\d{2}$/.test(value)) {
            throw new Error('Invalid month format. Expected: YYYY-MM')
        }
        return new Date(`${value}-01T00:00:00`)
    }
    if (typeOfInput === 'time') {
        if (!/^\d{2}:\d{2}(:\d{2})?$/.test(value)) {
            throw new Error('Invalid time format. Expected: HH:mm or HH:mm:ss')
        }
        // Use current date instead of 1970 to avoid timezone issues
        if (value.length === 8) {
            return new Date(`${currentYear}-${currentMonth + 1}-${currentDate}T${value}`)
        }
        return new Date(`${currentYear}-${currentMonth + 1}-${currentDate}T${value}:00`)
    }
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(value)) {
        throw new Error('Invalid datetime format. Expected: YYYY-MM-DDThh:mm or YYYY-MM-DDThh:mm:ss')
    }
    if (value.length === 16) {
        return new Date(`${value}:00`)
    }
    return new Date(`${value}`)
}
