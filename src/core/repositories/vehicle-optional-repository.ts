import { BaseRepository } from "./base-repository";
import type { VehicleOptional } from "../models/vehicle-optional";
import type { CreateVehicleOptionalDto } from "../dto/create-vehicle-optional.dto";
import type { UpdateVehicleOptionalDto } from "../dto/update-vehicle-optional-dto";
import type { Pagination } from "../models/pagination";

export class VehicleOptionalRepository extends BaseRepository {
    public async list(): Promise<Pagination<VehicleOptional>> {
        const response = await this.client.get<Pagination<VehicleOptional>>("/vehicle-optionals")
        return response.data
    }

    public async create(dto: CreateVehicleOptionalDto): Promise<VehicleOptional> {
        const response = await this.client.post<VehicleOptional>("/vehicle-optionals", dto)
        return response.data
    }

    public async update(id: number, dto: UpdateVehicleOptionalDto): Promise<VehicleOptional> {
        const response = await this.client.patch<VehicleOptional>(`/vehicle-optionals/${id}`, dto)
        return response.data
    }
}
