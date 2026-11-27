/**
 * Pads a number with leading zero if less than 10
 * @param num - Number to pad
 * @returns Padded number as string
 * @example
 * padTwoDigits(5) // '05'
 */
const padTwoDigits = (num: number) => num.toString().padStart(2, '0')

/**
 * Checks if a string is a valid ISO date string
 * @param dateString
 * @returns True if valid ISO date string
 * @example
 * isDateIsoString('2021-12-31T23:59:59.000Z') // true
 */
// Canonical UTC form, matching what `Date.prototype.toISOString()` produces.
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
export function isDateIsoString(dateString: unknown) {
    if (typeof dateString !== 'string') {
        return false
    }
    if (!ISO_DATE_REGEX.test(dateString)) {
        return false
    }
    const d = new Date(dateString)
    return !Number.isNaN(d.getTime()) && d.toISOString() === dateString
}

/**
 * Converts a Date object to a string value for input element
 * @param date - Date object or string
 * @param typeOfInput - Type of HTML input element
 * @param withSeconds - Include seconds in time value
 * @param withMilliseconds - Include the milliseconds too, unless they are 0, for a `step` below one second
 * @returns String value for input element
 * @example
 * getInputValueFromDate(new Date(), 'date') // '2021-12-31'
 * getInputValueFromDate(new Date(), 'time') // '23:59'
 * getInputValueFromDate(new Date(), 'datetime-local') // '2021-12-31T23:59'
 * getInputValueFromDate(new Date(), 'time', true, true) // '23:59:59.250'
 */
export function getInputValueFromDate(date: Date | string, typeOfInput: 'date' | 'time' | 'month' | 'datetime-local' = 'date', withSeconds?: boolean, withMilliseconds?: boolean) {
    if (typeof date === 'string') {
        if (!isDateIsoString(date)) {
            return ''
        }
    }
    const currentDate = new Date(date)
    if (Number.isNaN(currentDate.getTime())) {
        return ''
    }
    let toReturn = `${currentDate.getFullYear()}-${padTwoDigits(currentDate.getMonth() + 1)}`
    if (typeOfInput === 'month') {
        return toReturn
    }
    toReturn += `-${padTwoDigits(currentDate.getDate())}`
    if (typeOfInput === 'date') {
        return toReturn
    }
    let time = `${padTwoDigits(currentDate.getHours())}:${padTwoDigits(currentDate.getMinutes())}`
    if (withSeconds || withMilliseconds) {
        time += `:${padTwoDigits(currentDate.getSeconds())}`
    }
    // no fraction for whole seconds, as the browser writes them
    if (withMilliseconds && currentDate.getMilliseconds()) {
        time += `.${currentDate.getMilliseconds().toString().padStart(3, '0')}`
    }
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
 * @example
 * getDateFromInputValue('2021-12-31', 'date') // Date('2021-12-31T00:00:00')
 * getDateFromInputValue('23:59', 'time') // Date('2021-12-31T23:59:00')
 * getDateFromInputValue('23:59:59.25', 'time') // Date('2021-12-31T23:59:59.250')
 */
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/
const MONTH_REGEX = /^\d{4}-\d{2}$/
// A `step` below one second adds a fraction of up to three digits.
const TIME_REGEX = /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d{1,3})?)?$/
const DATETIME_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?$/

/**
 * A time as the field writes it, `HH:mm`, `HH:mm:ss` or `HH:mm:ss.s` with up
 * to three digits of fraction, in the full `HH:mm:ss.sss` form a `Date`
 * reads in local time.
 */
function getFullTime(time: string) {
    const [clock = '', fraction = ''] = time.split('.')
    const withSeconds = clock.length === 5 ? `${clock}:00` : clock
    return `${withSeconds}.${fraction.padEnd(3, '0')}`
}

export function getDateFromInputValue(value: string, typeOfInput: 'date' | 'time' | 'month' | 'datetime-local' = 'date') {
    if (!value?.trim()) {
        return null
    }

    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth()
    const currentDate = today.getDate()

    if (typeOfInput === 'date') {
        if (!DATE_REGEX.test(value)) {
            throw new Error('Invalid date format. Expected: YYYY-MM-DD')
        }
        return new Date(`${value}T00:00:00`)
    }
    if (typeOfInput === 'month') {
        if (!MONTH_REGEX.test(value)) {
            throw new Error('Invalid month format. Expected: YYYY-MM')
        }
        return new Date(`${value}-01T00:00:00`)
    }
    if (typeOfInput === 'time') {
        if (!TIME_REGEX.test(value)) {
            throw new Error('Invalid time format. Expected: HH:mm, HH:mm:ss or HH:mm:ss.sss')
        }
        return new Date(`${currentYear}-${padTwoDigits(currentMonth + 1)}-${padTwoDigits(currentDate)}T${getFullTime(value)}`)
    }
    if (!DATETIME_REGEX.test(value)) {
        throw new Error('Invalid datetime format. Expected: YYYY-MM-DDThh:mm, YYYY-MM-DDThh:mm:ss or YYYY-MM-DDThh:mm:ss.sss')
    }
    const [day, time] = value.split('T')
    return new Date(`${day}T${getFullTime(time as string)}`)
}
