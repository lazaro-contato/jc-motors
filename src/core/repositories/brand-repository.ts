import { BaseRepository } from "./base-repository"

import type { CreateBrandDto } from "../dto/brands/create-brand-dto"
import type { UpdateBrandDto } from "../dto/brands/update-brand-dto"
import type { Brand } from "../models/brand"
import type { Pagination } from "../models/pagination"

export class BrandRepository extends BaseRepository {
    public async create(dto: CreateBrandDto): Promise<Brand> {
        const response = await this.client.post<Brand>("/brands", dto)
        return response.data
    }

    public async update(id: number, dto: UpdateBrandDto): Promise<Brand> {
        const response = await this.client.put<Brand>(`/brands/${id}`, dto)
        return response.data
    }

    public async delete(id: number): Promise<void> {
        await this.client.delete(`/brands/${id}`)
    }

    public async getById(id: number): Promise<Brand> {
        const response = await this.client.get<Brand>(`/brands/${id}`)
        return response.data
    }

    public async list(name?: string ): Promise<Pagination<Brand>> {
        const response = await this.client.get<Pagination<Brand>>("/brands", { params: { name } })
        return response.data
    }
}
