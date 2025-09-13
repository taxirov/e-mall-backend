import { Seasonality } from "@prisma/client";

export type CreateProductDto = {
  name: string;
  minAge?: number;
  maxAge?: number;
  tags?: string[];
  dimensions?: string | null;
  seasonality?: Seasonality;
  categoryId?: number | null;
  subCategoryId?: number | null;
  companyId?: number | null;
};

export type UpdateProductDto = Partial<CreateProductDto>;

