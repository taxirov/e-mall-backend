export type CreateSubCategoryDto = {
  name: string;
  description?: string | null;
  categoryId: number;
};

export type UpdateSubCategoryDto = Partial<CreateSubCategoryDto>;

