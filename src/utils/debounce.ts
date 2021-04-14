export function debounce(fn: Function, wait: number) {
    let timeoutID: any = null
    return function () {
        if (timeoutID != null) clearTimeout(timeoutID)
        timeoutID = setTimeout(fn, wait)
    }
}
export function throttle(fn: Function, delay: number){
    let valid = true
    return function() {
        if(!valid){
            return false
        }
        valid = false
        setTimeout(() => {
            fn()
            valid = true;
        }, delay)
    }
}
