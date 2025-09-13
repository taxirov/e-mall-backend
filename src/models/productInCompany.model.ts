import { Currency, ProductStatus, Unit } from "@prisma/client";

export type CreateProductInCompanyDto = {
  productId: number;
  companyId: number;
  categoryId?: number | null;
  subCategoryId?: number | null;
  barcode?: string | null;
  description?: string | null;
  price?: number;
  discountPrice?: number | null;
  stock?: number;
  lowStock?: number;
  isFeatured?: boolean;
  minAge?: number;
  maxAge?: number;
  images?: string[];
  weight?: number | null;
  viewCount?: number;
  publishedAt?: Date | string | null;
  status?: ProductStatus;
  unit?: Unit;
  currency?: Currency;
};

export type UpdateProductInCompanyDto = Partial<CreateProductInCompanyDto>;

