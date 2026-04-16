import type { Transaction } from "../models/transaction"
import { BaseRepository } from "./base-repository"
import { transactionListParamsSchema, type TransactionListParamsDto } from "../dto/transaction-list-params-dto"
import type { Pagination } from "../models/pagination"
import { PayableTransactionType } from "../models/transaction-type"
import type { CreateVehiclePayableDto } from "../dto/create-vehicle-payable-dto"
import type { CreateCustomerPayableDto } from "../dto/create-customer-payable-dto"
import type { CreateProviderPayableDto } from "../dto/create-provider-payable-dto"

export class TransactionRepository extends BaseRepository {

    public async createVehiclePayable(dto: CreateVehiclePayableDto): Promise<Transaction> {
        const response = await this.client.post<Transaction>("/transactions/payable/vehicle", dto)
        return response.data
    }

    public async createCustomerPayable(dto: CreateCustomerPayableDto): Promise<Transaction> {
        const response = await this.client.post<Transaction>("/transactions/payable/customer", dto)
        return response.data
    }

    public async createProviderPayable(dto: CreateProviderPayableDto): Promise<Transaction> {
        const response = await this.client.post<Transaction>("/transactions/payable/provider", dto)
        return response.data
    }

    public async list(params: TransactionListParamsDto): Promise<Pagination<Transaction>> {
        const response = await this.client.get<Pagination<Transaction>>("/transactions", { params })
        return response.data
    }

    public async listPayableByVehicle(vehicleId: number): Promise<Pagination<Transaction>> {
        const params = transactionListParamsSchema.parse({
            vehicle: vehicleId,
            type: PayableTransactionType,
        })
        return this.list(params)
    }

}