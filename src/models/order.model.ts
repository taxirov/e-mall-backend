import { OrderStatus, Role } from "@prisma/client";

export type CreateOrderDto = {
  status?: OrderStatus;
  items?: { productId: number; quantity?: number; price: number; productInCompanyId?: number | null }[];
};

export type AddAssignmentDto = { userId: number; role: Role };

export type AddOrderItemDto = { productId: number; quantity?: number; price: number; productInCompanyId?: number | null };

