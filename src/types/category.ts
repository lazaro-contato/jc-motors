export interface Category {
  id: string
  name: string
  image: string | null
  isActive: boolean
}

export interface CreateCategoryDTO {
  name: string
  image?: string
  isActive?: boolean
}

export type UpdateCategoryDTO = Partial<CreateCategoryDTO>
