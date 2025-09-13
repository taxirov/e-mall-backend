import Joi from "joi";
import { LocationType } from "@prisma/client";

export const createLocationSchema = Joi.object({
  type: Joi.string().valid(...Object.values(LocationType)).required(),
  companyId: Joi.number().integer().allow(null),
  branchId: Joi.number().integer().allow(null),
  storageId: Joi.number().integer().allow(null),
});

export const updateLocationSchema = Joi.object({
  type: Joi.string().valid(...Object.values(LocationType)),
  companyId: Joi.number().integer().allow(null),
  branchId: Joi.number().integer().allow(null),
  storageId: Joi.number().integer().allow(null),
}).min(1);

