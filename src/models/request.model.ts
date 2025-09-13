import { Role } from "@prisma/client";

export type CreateRequestDto = {
  requesterId: number;
  companyId: number;
  // Target can be provided by either userId or (nickname/phone)
  targetUserId?: number;
  targetNicknameOrPhone?: string; // search by nickname or phone
  roles: Role[];
  salary?: number | null;
  message?: string | null;
};

export type UpdateRequestStatusDto = {
  status: "CONFIRMED" | "CANCELLED"; // using RequestStatus values
};

