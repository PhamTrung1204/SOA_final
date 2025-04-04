export function validateNumberForTextField({ min, max, value, key }) {
    console.log(min, max, value, key)
    return (
        !/[0-9]/.test(key) &&
        key !== 'Backspace' &&
        key !== 'Delete' &&
        key !== 'ArrowLeft' &&
        key !== 'ArrowRight' &&
        key !== 'Tab' &&
        key !== '.' &&
        key !== '-' &&
        typeof value === 'string' ||
        (
            value >= min &&
            value <= max
        )
    )
}