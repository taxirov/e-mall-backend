export type CreateCategoryDto = {
  name: string;
  description?: string | null;
};

export type UpdateCategoryDto = Partial<CreateCategoryDto>;

