import type { RefreshTokenDto } from "../dto/refresh-token-dto"
import type { SigninDto } from "../dto/signin-dto"
import type { AuthPayload } from "../models/auth-payload"
import type { RefreshPayload } from "../models/refresh-payload"

import { BaseRepository } from "./base-repository"

export class AuthRepository extends BaseRepository {

    public async signin(dto: SigninDto) {
        const response = await this.client.post<AuthPayload>("/auth/signin", dto)
        return response.data
    }

    public async refreshToken(dto: RefreshTokenDto) {
        const response = await this.client.post<RefreshPayload>("/auth/refresh", dto)
        return response.data
    }

}
