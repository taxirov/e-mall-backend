export type CreateStockDto = {
  locationId: number;
  productId: number;
  quantity?: number;
};

export type UpdateStockDto = Partial<CreateStockDto>;

