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

export function getDateFromInputValue(value: string, typeOfInput: 'date' | 'time' | 'month' | 'datetime-local' = 'date') {
    if (typeOfInput === 'date') {
        return new Date(`${value}T00:00:00`)
    }
    if (typeOfInput === 'month') {
        return new Date(`${value}-01T00:00:00`)
    }
    if (typeOfInput === 'time') {
        if (value.length === 8) {
            return new Date(`1970-01-01T${value}`)
        }
        return new Date(`1970-01-01T${value}:00`)
    }
    if (value.length === 16) {
        return new Date(`${value}:00`)
    }
    return new Date(`${value}`)
}
