export function debug(str: string) {
    if (typeof printErr !== 'undefined') {
        // Don't print in codingame
    } else if (typeof console !== 'undefined') {
        console.log(str);
    }
}

export function info(str: string) {
    if (typeof printErr !== 'undefined') {
        printErr(str);
    } else if (typeof console !== 'undefined') {
        console.log(str);
    }
}