import Joi from "joi";
import { Role } from "@prisma/client";

export const createRequestSchema = Joi.object({
  requesterId: Joi.number().integer().required(),
  companyId: Joi.number().integer().required(),
  targetUserId: Joi.number().integer(),
  targetNicknameOrPhone: Joi.string(),
  roles: Joi.array().items(Joi.string().valid(...Object.values(Role))).min(1).required(),
  salary: Joi.number().integer().min(0).allow(null),
  message: Joi.string().allow(null, ""),
}).xor("targetUserId", "targetNicknameOrPhone");

