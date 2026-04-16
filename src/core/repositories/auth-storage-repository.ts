import { getLocalStorage, removeLocalStorage, setLocalStorage } from "../lib/local-storage"

import type { AuthUser } from "../models/auth-user"

const ACCESS_TOKEN_KEY = '@jgmotors-web:access-token'
const REFRESH_TOKEN_KEY = '@jgmotors-web:refresh-token'
const USER_DATA_KEY = '@jgmotors-web:user-data'

export class AuthStorageRepository {

    public getAccessToken(): string | null {
        return getLocalStorage<string>(ACCESS_TOKEN_KEY)
    }

    public getRefreshToken(): string | null {
        return getLocalStorage<string>(REFRESH_TOKEN_KEY)
    }

    public getUserData(): AuthUser | null {
        return getLocalStorage<AuthUser>(USER_DATA_KEY)
    }

    public setAccessToken(token: string) {
        setLocalStorage(ACCESS_TOKEN_KEY, token)
    }

    public setRefreshToken(token: string) {
        setLocalStorage(REFRESH_TOKEN_KEY, token)
    }

    public setUserData(user: AuthUser) {
        setLocalStorage(USER_DATA_KEY, user)
    }

    public removeAccessToken() {
        removeLocalStorage(ACCESS_TOKEN_KEY)
    }

    public removeRefreshToken() {
        removeLocalStorage(REFRESH_TOKEN_KEY)
    }

    public removeUserData() {
        removeLocalStorage(USER_DATA_KEY)
    }

    public clear() {
        this.removeAccessToken()
        this.removeRefreshToken()
        this.removeUserData()
    }
}