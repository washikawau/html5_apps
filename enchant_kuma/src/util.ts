
export async function sleep(millis: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, millis));
}

export function* seq(len: number) {
    for (let i = 0; i < len; i++) {
        yield i
    }
}

export function randfloat(min: number, max: number): number {
    return Math.random() * (max - min) + min
}

export interface Array<T> {
    erase(elem: T): Array<T>
}
