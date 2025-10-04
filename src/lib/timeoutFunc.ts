// This function is here only for testing purposes
export function timeout(delay: number) {
    return new Promise( res => setTimeout(res, delay) );
}