import { LocationType } from "@prisma/client";

export type CreateInventoryLocationDto = {
  type: LocationType;
  companyId?: number | null;
  branchId?: number | null;
  storageId?: number | null;
};

export type UpdateInventoryLocationDto = Partial<CreateInventoryLocationDto>;

