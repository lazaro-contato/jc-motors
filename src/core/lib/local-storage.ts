export function getLocalStorage<T>(key: string): T | null {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) as T : null
}

export function setLocalStorage<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value) as unknown as string)
}

export function removeLocalStorage(key: string) {
    localStorage.removeItem(key)
    return null
}
