import type { AxiosInstance } from "axios"

export class BaseRepository {
    protected readonly client: AxiosInstance

    constructor(client: AxiosInstance) {
        this.client = client
    }
}
