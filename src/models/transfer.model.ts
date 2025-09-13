import { TransferStatus } from "@prisma/client";

export type CreateTransferDto = {
  fromLocationId: number;
  toLocationId: number;
  note?: string | null;
  status?: TransferStatus;
  items?: { productId: number; quantity: number }[];
};

export type AddTransferItemDto = { productId: number; quantity: number };

